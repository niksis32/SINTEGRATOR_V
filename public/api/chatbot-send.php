<?php
declare(strict_types=1);

/**
 * POST /api/chatbot-send.php
 * Body (JSON): { "message": "text", "pageUrl": "https://...", "toChatId": "10000000" }
 *
 * Sends incoming website chat message to manager via GREEN-API (MAX).
 *
 * Secret file lookup (first found wins):
 * - public/api/chatbot.secret.php
 * - public/private/chatbot.secret.php
 * - domains root sibling: ../private/chatbot.secret.php (when deployed to public_html/api)
 *
 * Secret file must return an array:
 * [
 *   'green_api_url' => 'https://api.green-api.com' OR 'https://3100.api.green-api.com',
 *   'id_instance' => '3000000001',
 *   'api_token' => '***',
 *   'manager_chat_id' => '10000000', // MAX chatId
 *   // optional:
 *   'project_label' => 'SINTEGRATOR',
 *   'allow_override_chat_id' => false, // allow "toChatId" from request body (recommended: keep false)
 * ]
 */

header('Content-Type: application/json; charset=utf-8');

function json_out(int $status, array $payload): void {
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

// Make fatal errors visible to the client during integration
set_exception_handler(function (Throwable $e): void {
  json_out(500, [
    'ok' => false,
    'error' => 'php_exception',
    'message' => $e->getMessage(),
  ]);
});

register_shutdown_function(function (): void {
  $err = error_get_last();
  if (!$err) return;
  $type = (int)($err['type'] ?? 0);
  // Fatal types
  if (!in_array($type, [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) return;
  json_out(500, [
    'ok' => false,
    'error' => 'php_fatal',
    'message' => (string)($err['message'] ?? ''),
  ]);
});

if (!function_exists('curl_init')) {
  json_out(500, ['ok' => false, 'error' => 'curl_missing']);
}
if (!function_exists('mb_strlen')) {
  json_out(500, ['ok' => false, 'error' => 'mbstring_missing']);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_out(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

function read_json_body(): array {
  $raw = file_get_contents('php://input');
  if ($raw === false || trim($raw) === '') return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function safe_trim(?string $s): string {
  return trim((string)$s);
}

function clip(string $s, int $max): string {
  if ($max <= 0) return '';
  if (mb_strlen($s, 'UTF-8') <= $max) return $s;
  return mb_substr($s, 0, $max, 'UTF-8');
}

function rate_limit_key(): string {
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
  return hash('sha256', $ip . '|' . $ua);
}

function rate_limit_check(int $windowSeconds = 10): void {
  $tmp = sys_get_temp_dir();
  $key = rate_limit_key();
  $file = $tmp . DIRECTORY_SEPARATOR . 'sintegrator_chat_rl_' . $key;
  $now = time();
  if (is_file($file)) {
    $prev = (int)@file_get_contents($file);
    if ($prev > 0 && ($now - $prev) < $windowSeconds) {
      json_out(429, ['ok' => false, 'error' => 'rate_limited']);
    }
  }
  @file_put_contents($file, (string)$now, LOCK_EX);
}

function load_chatbot_config(): array {
  $candidates = [
    __DIR__ . DIRECTORY_SEPARATOR . 'chatbot.secret.php',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'chatbot.secret.php',
    dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'chatbot.secret.php',
  ];

  foreach ($candidates as $path) {
    if (is_file($path)) {
      $cfg = include $path;
      if (is_array($cfg)) return $cfg;
    }
  }

  // Fallback: environment variables (may be unavailable under Apache/FPM on shared hosting)
  return [
    'green_api_url' => getenv('SINTEGRATOR_GREEN_API_URL') ?: '',
    'id_instance' => getenv('SINTEGRATOR_GREEN_ID_INSTANCE') ?: '',
    'api_token' => getenv('SINTEGRATOR_GREEN_API_TOKEN') ?: '',
    'manager_chat_id' => getenv('SINTEGRATOR_MANAGER_CHAT_ID') ?: '',
    'project_label' => getenv('SINTEGRATOR_PROJECT_LABEL') ?: 'SINTEGRATOR',
  ];
}

function runtime_path(): string {
  return dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'chatbot.runtime.json';
}

function read_runtime_manager_chat_id(): string {
  $path = runtime_path();
  if (!is_file($path)) return '';
  $raw = @file_get_contents($path);
  if (!is_string($raw) || trim($raw) === '') return '';
  $data = json_decode($raw, true);
  if (!is_array($data)) return '';
  $v = $data['manager_chat_id'] ?? '';
  return is_string($v) ? trim($v) : '';
}

function build_green_send_message_url(string $baseUrl, string $idInstance, string $apiToken): string {
  $baseUrl = rtrim($baseUrl, '/');
  // GREEN-API allows calling MAX methods via waInstance... for unified API
  // Use method name exactly as in GREEN-API examples: sendMessage
  return $baseUrl . '/waInstance' . rawurlencode($idInstance) . '/sendMessage/' . rawurlencode($apiToken);
}

function http_post_json(string $url, array $body, int $timeoutSeconds = 12): array {
  $ch = curl_init($url);
  if ($ch === false) {
    return ['ok' => false, 'error' => 'curl_init_failed'];
  }

  $payload = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($payload === false) {
    return ['ok' => false, 'error' => 'json_encode_failed'];
  }

  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/json',
      'Accept: application/json',
    ],
    CURLOPT_CONNECTTIMEOUT => $timeoutSeconds,
    CURLOPT_TIMEOUT => $timeoutSeconds,
  ]);

  $respBody = curl_exec($ch);
  $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $curlErr = curl_error($ch);
  curl_close($ch);

  if ($respBody === false) {
    return ['ok' => false, 'error' => 'curl_exec_failed', 'details' => $curlErr];
  }

  $decoded = json_decode($respBody, true);
  if (!is_array($decoded)) $decoded = ['raw' => $respBody];

  if ($httpCode < 200 || $httpCode >= 300) {
    return [
      'ok' => false,
      'error' => 'green_api_http_error',
      'httpCode' => $httpCode,
      'response' => $decoded,
    ];
  }

  return ['ok' => true, 'httpCode' => $httpCode, 'response' => $decoded];
}

$body = read_json_body();
$message = safe_trim($body['message'] ?? '');
$pageUrl = safe_trim($body['pageUrl'] ?? '');
$toChatId = safe_trim($body['toChatId'] ?? '');

if ($message === '') {
  json_out(400, ['ok' => false, 'error' => 'bad_request']);
}

// Basic anti-abuse: keep payload small
$message = clip($message, 2000);
$pageUrl = clip($pageUrl, 400);

// Allow sending multiple messages in a row without false negatives (admin test + widget, or fast user typing)
rate_limit_check(2);

$cfg = load_chatbot_config();
$apiUrl = (string)($cfg['green_api_url'] ?? '');
$idInstance = (string)($cfg['id_instance'] ?? '');
$apiToken = (string)($cfg['api_token'] ?? '');
$managerChatId = (string)($cfg['manager_chat_id'] ?? '');
$label = (string)($cfg['project_label'] ?? 'SINTEGRATOR');
$allowOverride = ($cfg['allow_override_chat_id'] ?? false) === true;

if ($apiUrl === '' || $idInstance === '' || $apiToken === '' || $managerChatId === '') {
  json_out(500, ['ok' => false, 'error' => 'chatbot_not_configured']);
}

$runtimeManager = read_runtime_manager_chat_id();
if ($runtimeManager !== '') {
  $managerChatId = $runtimeManager;
}

$targetChatId = $managerChatId;
if ($allowOverride && $toChatId !== '') {
  $raw = clip($toChatId, 64);
  // Support phone input for test: "79991234567" => "79991234567@c.us"
  // If admin provides already formatted chatId (contains "@"), use as-is.
  if (strpos($raw, '@') === false) {
    $digits = preg_replace('/\D+/', '', $raw);
    if (is_string($digits) && $digits !== '') {
      $raw = $digits . '@c.us';
    }
  }
  $targetChatId = $raw;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

$text = "💬 {$label} — сообщение с сайта\n"
  . "--------------------------\n"
  . $message . "\n\n"
  . ($pageUrl !== '' ? ("Страница: " . $pageUrl . "\n") : '')
  . "IP: " . $ip . "\n"
  . ($ua !== '' ? ("UA: " . clip($ua, 160) . "\n") : '');

$url = build_green_send_message_url($apiUrl, $idInstance, $apiToken);
$result = http_post_json($url, [
  'chatId' => $targetChatId,
  'message' => $text,
]);

if (!$result['ok']) {
  json_out(502, [
    'ok' => false,
    'error' => 'send_failed',
    'details' => $result['error'] ?? 'unknown',
    'green' => [
      'httpCode' => $result['httpCode'] ?? null,
      'response' => $result['response'] ?? null,
    ],
  ]);
}

$greenResponse = $result['response'] ?? null;
$messageId = null;
if (is_array($greenResponse)) {
  // Common variants across products
  if (isset($greenResponse['idMessage'])) $messageId = (string)$greenResponse['idMessage'];
  elseif (isset($greenResponse['messageId'])) $messageId = (string)$greenResponse['messageId'];
}

json_out(200, [
  'ok' => true,
  'targetChatId' => $targetChatId,
  'green' => [
    'httpCode' => $result['httpCode'] ?? 200,
    'messageId' => $messageId,
    'response' => $greenResponse,
  ],
]);

