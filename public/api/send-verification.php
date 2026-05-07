<?php
declare(strict_types=1);

/**
 * POST /api/send-verification.php
 * Body (JSON): { "to": "email@example.com", "confirmUrl": "https://.../verify-email?token=..." }
 *
 * SMTP settings are loaded from a secret php file (recommended) or environment variables.
 *
 * Secret file lookup (first found wins):
 * - public/api/send-verification.secret.php
 * - public/private/send-verification.secret.php
 * - domains root sibling: ../private/send-verification.secret.php (when deployed to public_html/api)
 *
 * Secret file must return an array:
 * [
 *   'host' => 'smtp.example.com',
 *   'port' => 587,
 *   'encryption' => 'tls' | 'ssl' | 'none',
 *   'username' => 'info@sintegrator.site',
 *   'password' => '***',
 *   'from_email' => 'info@sintegrator.site',
 *   'from_name' => 'SINTEGRATOR',
 * ]
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

function is_valid_email(string $email): bool {
  return (bool)filter_var($email, FILTER_VALIDATE_EMAIL);
}

function starts_with(string $s, string $prefix): bool {
  return strncmp($s, $prefix, strlen($prefix)) === 0;
}

function get_site_origin(): ?string {
  $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
  $host = $_SERVER['HTTP_HOST'] ?? '';
  if ($host === '') return null;
  return $scheme . '://' . $host;
}

function rate_limit_key(string $email): string {
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  return hash('sha256', $ip . '|' . strtolower($email));
}

function rate_limit_check(string $email, int $windowSeconds = 25): void {
  $tmp = sys_get_temp_dir();
  $key = rate_limit_key($email);
  $file = $tmp . DIRECTORY_SEPARATOR . 'sintegrator_mail_rl_' . $key;
  $now = time();
  if (is_file($file)) {
    $prev = (int)@file_get_contents($file);
    if ($prev > 0 && ($now - $prev) < $windowSeconds) {
      json_out(429, ['ok' => false, 'error' => 'rate_limited']);
    }
  }
  @file_put_contents($file, (string)$now, LOCK_EX);
}

function load_smtp_config(): array {
  $candidates = [
    __DIR__ . DIRECTORY_SEPARATOR . 'send-verification.secret.php',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'send-verification.secret.php',
    dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'private' . DIRECTORY_SEPARATOR . 'send-verification.secret.php',
  ];

  foreach ($candidates as $path) {
    if (is_file($path)) {
      $cfg = include $path;
      if (is_array($cfg)) return $cfg;
    }
  }

  // Fallback: environment variables (may be unavailable under Apache/FPM on shared hosting)
  return [
    'host' => getenv('SINTEGRATOR_SMTP_HOST') ?: '',
    'port' => (int)(getenv('SINTEGRATOR_SMTP_PORT') ?: 0),
    'encryption' => getenv('SINTEGRATOR_SMTP_ENCRYPTION') ?: '',
    'username' => getenv('SINTEGRATOR_SMTP_USERNAME') ?: '',
    'password' => getenv('SINTEGRATOR_SMTP_PASSWORD') ?: '',
    'from_email' => getenv('SINTEGRATOR_SMTP_FROM_EMAIL') ?: '',
    'from_name' => getenv('SINTEGRATOR_SMTP_FROM_NAME') ?: 'SINTEGRATOR',
  ];
}

function smtp_read($fp): string {
  $data = '';
  while (!feof($fp)) {
    $line = fgets($fp, 515);
    if ($line === false) break;
    $data .= $line;
    // multi-line replies have "XYZ-" until last "XYZ "
    if (preg_match('/^\d{3} /', $line)) break;
  }
  return $data;
}

function smtp_expect($fp, array $codes, string $stage): void {
  $resp = smtp_read($fp);
  if (!preg_match('/^(\d{3}) /', $resp, $m)) {
    json_out(502, ['ok' => false, 'error' => 'smtp_bad_response', 'stage' => $stage, 'response' => $resp]);
  }
  $code = (int)$m[1];
  if (!in_array($code, $codes, true)) {
    json_out(502, ['ok' => false, 'error' => 'smtp_unexpected_code', 'stage' => $stage, 'code' => $code, 'response' => $resp]);
  }
}

function smtp_cmd($fp, string $cmd, array $codes, string $stage): void {
  fwrite($fp, $cmd . "\r\n");
  smtp_expect($fp, $codes, $stage);
}

function smtp_send_mail(array $cfg, string $to, string $subject, string $htmlBody, string $textBody): void {
  $host = (string)($cfg['host'] ?? '');
  $port = (int)($cfg['port'] ?? 0);
  $enc = strtolower((string)($cfg['encryption'] ?? ''));
  $user = (string)($cfg['username'] ?? '');
  $pass = (string)($cfg['password'] ?? '');
  $fromEmail = (string)($cfg['from_email'] ?? '');
  $fromName = (string)($cfg['from_name'] ?? 'SINTEGRATOR');

  if ($host === '' || $port <= 0 || $user === '' || $pass === '' || $fromEmail === '') {
    json_out(500, ['ok' => false, 'error' => 'smtp_not_configured']);
  }

  $remote = ($enc === 'ssl') ? "ssl://{$host}:{$port}" : "{$host}:{$port}";
  $fp = @stream_socket_client($remote, $errno, $errstr, 12, STREAM_CLIENT_CONNECT);
  if (!$fp) {
    json_out(502, ['ok' => false, 'error' => 'smtp_connect_failed', 'errno' => $errno, 'message' => $errstr]);
  }
  stream_set_timeout($fp, 12);

  smtp_expect($fp, [220], 'connect');
  smtp_cmd($fp, "EHLO sintegrator.site", [250], 'ehlo');

  if ($enc === 'tls') {
    smtp_cmd($fp, "STARTTLS", [220], 'starttls');
    if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
      json_out(502, ['ok' => false, 'error' => 'smtp_starttls_failed']);
    }
    smtp_cmd($fp, "EHLO sintegrator.site", [250], 'ehlo_tls');
  }

  // AUTH LOGIN
  smtp_cmd($fp, "AUTH LOGIN", [334], 'auth_login');
  smtp_cmd($fp, base64_encode($user), [334], 'auth_user');
  smtp_cmd($fp, base64_encode($pass), [235], 'auth_pass');

  smtp_cmd($fp, "MAIL FROM:<{$fromEmail}>", [250], 'mail_from');
  smtp_cmd($fp, "RCPT TO:<{$to}>", [250, 251], 'rcpt_to');
  smtp_cmd($fp, "DATA", [354], 'data');

  $boundary = '=_sintegrator_' . bin2hex(random_bytes(12));
  $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
  $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

  $headers = [];
  $headers[] = "From: {$encodedFromName} <{$fromEmail}>";
  $headers[] = "To: <{$to}>";
  $headers[] = "Subject: {$encodedSubject}";
  $headers[] = "MIME-Version: 1.0";
  $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";

  $msg = implode("\r\n", $headers) . "\r\n\r\n";
  $msg .= "--{$boundary}\r\n";
  $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
  $msg .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
  $msg .= $textBody . "\r\n\r\n";
  $msg .= "--{$boundary}\r\n";
  $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
  $msg .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
  $msg .= $htmlBody . "\r\n\r\n";
  $msg .= "--{$boundary}--\r\n";

  // dot-stuffing
  $msg = preg_replace("/\r\n\./", "\r\n..", $msg);
  fwrite($fp, $msg . "\r\n.\r\n");
  smtp_expect($fp, [250], 'data_end');

  smtp_cmd($fp, "QUIT", [221], 'quit');
  fclose($fp);
}

$body = read_json_body();
$to = (string)($body['to'] ?? '');
$confirmUrl = (string)($body['confirmUrl'] ?? '');

if ($to === '' || $confirmUrl === '') {
  json_out(400, ['ok' => false, 'error' => 'bad_request']);
}
if (!is_valid_email($to)) {
  json_out(400, ['ok' => false, 'error' => 'invalid_email']);
}

rate_limit_check($to);

// Basic anti-abuse: allow only links to this site origin
$origin = get_site_origin();
if ($origin) {
  if (!starts_with($confirmUrl, $origin . '/')) {
    json_out(400, ['ok' => false, 'error' => 'invalid_confirm_url']);
  }
}

$cfg = load_smtp_config();

$subject = 'Подтверждение регистрации — SINTEGRATOR';
$safeUrl = htmlspecialchars($confirmUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$html = "<p>Здравствуйте!</p>\n"
  . "<p>Подтвердите регистрацию, перейдя по ссылке:</p>\n"
  . "<p><a href=\"{$safeUrl}\">{$safeUrl}</a></p>\n"
  . "<p>Если вы не регистрировались на сайте SINTEGRATOR — просто игнорируйте это письмо.</p>";

$text = "Здравствуйте!\n\n"
  . "Подтвердите регистрацию по ссылке:\n"
  . $confirmUrl . "\n\n"
  . "Если вы не регистрировались на сайте SINTEGRATOR — просто игнорируйте это письмо.\n";

smtp_send_mail($cfg, $to, $subject, $html, $text);
json_out(200, ['ok' => true]);

