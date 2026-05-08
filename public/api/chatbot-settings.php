<?php
declare(strict_types=1);

/**
 * POST /api/chatbot-settings.php
 * Body (JSON):
 *  - { "adminKey": "...", "managerChatId": "..." }  => save runtime manager chatId
 *  - { "adminKey": "..." }                          => read current runtime manager chatId
 *
 * Uses secret config in chatbot.secret.php to validate adminKey:
 * [
 *   ... green-api fields ...,
 *   'admin_key' => '***',
 * ]
 *
 * Runtime file (not committed): public/private/chatbot.runtime.json
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

function clip(string $s, int $max): string {
  if ($max <= 0) return '';
  if (mb_strlen($s, 'UTF-8') <= $max) return $s;
  return mb_substr($s, 0, $max, 'UTF-8');
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
    'admin_key' => getenv('SINTEGRATOR_CHATBOT_ADMIN_KEY') ?: '',
  ];
}

function runtime_path(): string {
  $dir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private';
  if (!is_dir($dir)) {
    @mkdir($dir, 0775, true);
  }
  return $dir . DIRECTORY_SEPARATOR . 'chatbot.runtime.json';
}

function read_runtime(): array {
  $path = runtime_path();
  if (!is_file($path)) return [];
  $raw = @file_get_contents($path);
  if (!is_string($raw) || trim($raw) === '') return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function write_runtime(array $data): bool {
  $path = runtime_path();
  $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($json === false) return false;
  return @file_put_contents($path, $json, LOCK_EX) !== false;
}

$body = read_json_body();
$adminKey = safe_trim($body['adminKey'] ?? '');
$managerChatId = safe_trim($body['managerChatId'] ?? '');

$cfg = load_chatbot_config();
$expected = (string)($cfg['admin_key'] ?? '');
if ($expected === '' || $adminKey === '' || !hash_equals($expected, $adminKey)) {
  json_out(403, ['ok' => false, 'error' => 'forbidden']);
}

$runtime = read_runtime();

if ($managerChatId !== '') {
  $runtime['manager_chat_id'] = clip($managerChatId, 64);
  $runtime['updated_at'] = gmdate('c');
  if (!write_runtime($runtime)) {
    json_out(500, ['ok' => false, 'error' => 'runtime_write_failed']);
  }
}

$out = read_runtime();
json_out(200, [
  'ok' => true,
  'managerChatId' => (string)($out['manager_chat_id'] ?? ''),
  'updatedAt' => (string)($out['updated_at'] ?? ''),
]);

