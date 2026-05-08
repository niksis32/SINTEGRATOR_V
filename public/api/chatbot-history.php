<?php
declare(strict_types=1);

/**
 * POST /api/chatbot-history.php
 * Body (JSON): { "adminKey": "...", "chatId": "7999...@c.us", "count": 50 }
 *
 * Reads chat history via GREEN-API getChatHistory and returns a compact list.
 *
 * Requires 'admin_key' in chatbot.secret.php or env SINTEGRATOR_CHATBOT_ADMIN_KEY.
 */

header('Content-Type: application/json; charset=utf-8');

function json_out(int $status, array $payload): void {
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
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

function safe_trim($s): string {
  return trim((string)$s);
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

  return [
    'green_api_url' => getenv('SINTEGRATOR_GREEN_API_URL') ?: '',
    'id_instance' => getenv('SINTEGRATOR_GREEN_ID_INSTANCE') ?: '',
    'api_token' => getenv('SINTEGRATOR_GREEN_API_TOKEN') ?: '',
    'admin_key' => getenv('SINTEGRATOR_CHATBOT_ADMIN_KEY') ?: '',
  ];
}

function build_url(string $baseUrl, string $idInstance, string $method, string $apiToken): string {
  $baseUrl = rtrim($baseUrl, '/');
  return $baseUrl . '/waInstance' . rawurlencode($idInstance) . '/' . $method . '/' . rawurlencode($apiToken);
}

function http_post_json(string $url, array $body, int $timeoutSeconds = 12): array {
  $ch = curl_init($url);
  if ($ch === false) return ['ok' => false, 'error' => 'curl_init_failed'];

  $payload = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($payload === false) return ['ok' => false, 'error' => 'json_encode_failed'];

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

  if ($respBody === false) return ['ok' => false, 'error' => 'curl_exec_failed', 'details' => $curlErr];

  $decoded = json_decode($respBody, true);
  if (!is_array($decoded)) $decoded = ['raw' => $respBody];

  if ($httpCode < 200 || $httpCode >= 300) {
    return ['ok' => false, 'error' => 'green_api_http_error', 'httpCode' => $httpCode, 'response' => $decoded];
  }

  return ['ok' => true, 'httpCode' => $httpCode, 'response' => $decoded];
}

$body = read_json_body();
$adminKey = safe_trim($body['adminKey'] ?? '');
$chatId = safe_trim($body['chatId'] ?? '');
$count = (int)($body['count'] ?? 50);
if ($count <= 0) $count = 50;
if ($count > 200) $count = 200;

if ($chatId === '') {
  json_out(400, ['ok' => false, 'error' => 'bad_request']);
}

$cfg = load_chatbot_config();
$expected = (string)($cfg['admin_key'] ?? '');
if ($expected === '' || $adminKey === '' || !hash_equals($expected, $adminKey)) {
  json_out(403, ['ok' => false, 'error' => 'forbidden']);
}

$apiUrl = (string)($cfg['green_api_url'] ?? '');
$idInstance = (string)($cfg['id_instance'] ?? '');
$apiToken = (string)($cfg['api_token'] ?? '');
if ($apiUrl === '' || $idInstance === '' || $apiToken === '') {
  json_out(500, ['ok' => false, 'error' => 'chatbot_not_configured']);
}

// Method per GREEN-API docs: getChatHistory (POST)
$url = build_url($apiUrl, $idInstance, 'getChatHistory', $apiToken);
$res = http_post_json($url, [
  'chatId' => $chatId,
  'count' => $count,
]);

if (!$res['ok']) {
  json_out(502, ['ok' => false, 'error' => 'green_api_failed', 'green' => $res]);
}

$items = $res['response'];
if (!is_array($items)) $items = [];

$messages = [];
foreach ($items as $m) {
  if (!is_array($m)) continue;
  $type = (string)($m['type'] ?? '');
  $ts = (int)($m['timestamp'] ?? 0);
  $text = '';
  if (isset($m['textMessage']) && is_string($m['textMessage'])) $text = $m['textMessage'];
  elseif (isset($m['caption']) && is_string($m['caption'])) $text = $m['caption'];
  $messages[] = [
    'type' => $type,
    'timestamp' => $ts,
    'idMessage' => (string)($m['idMessage'] ?? ''),
    'statusMessage' => (string)($m['statusMessage'] ?? ''),
    'sendByApi' => (bool)($m['sendByApi'] ?? false),
    'typeMessage' => (string)($m['typeMessage'] ?? ''),
    'text' => $text,
  ];
}

json_out(200, [
  'ok' => true,
  'chatId' => $chatId,
  'count' => $count,
  'messages' => $messages,
]);

