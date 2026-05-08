import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function writeRobotsTxt(env) {
  const block = env.VITE_BLOCK_SEARCH_ROBOTS === 'true';
  const origin = (env.VITE_SITE_ORIGIN || 'https://sintegrator.ru').replace(/\/$/, '');
  const lines = block
    ? [
        'User-agent: *',
        'Disallow: /',
        '',
        '# Сайт закрыт от индексации: при сборке было VITE_BLOCK_SEARCH_ROBOTS=true',
        '# Чтобы открыть: установите VITE_BLOCK_SEARCH_ROBOTS=false (или удалите) и пересоберите.',
        '',
      ]
    : [
        'User-agent: *',
        'Allow: /',
        '',
        '# Служебные страницы закрываются через meta robots в приложении (например /verify-email).',
        '',
        `Sitemap: ${origin}/sitemap.xml`,
        '',
      ];
  const out = path.resolve(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(out, lines.join('\n'), 'utf8');
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (command === 'serve' || command === 'build') {
    writeRobotsTxt(env);
  }
  return {
    plugins: [react()],
    server: {
      /**
       * Local dev: Vite cannot execute PHP.
       * Configure your PHP server (Apache/Nginx/OpenServer/XAMPP/php -S) to serve the `public/` folder
       * and proxy /api requests to it.
       *
       * Example (PHP built-in):
       *   php -S 127.0.0.1:8081 -t public
       * Then set:
       *   VITE_PHP_API_ORIGIN=http://127.0.0.1:8081
       */
      proxy: {
        '/api': {
          target: env.VITE_PHP_API_ORIGIN || 'http://127.0.0.1:8081',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
