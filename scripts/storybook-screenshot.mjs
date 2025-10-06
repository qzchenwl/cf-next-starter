import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const port = Number(process.env.STORYBOOK_SCREENSHOT_PORT ?? 7007);
const storyIdArg = process.argv.find((arg) => arg.startsWith('--id='));
const storyId = storyIdArg ? storyIdArg.split('=')[1] : 'components-button--primary';
const outDirArg = process.argv.find((arg) => arg.startsWith('--out='));
const outDir = outDirArg ? outDirArg.split('=')[1] : 'storybook-static/screenshots';

const baseDir = resolve(process.cwd(), 'storybook-static');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sanitize(urlPath) {
  return urlPath.split('?')[0].split('#')[0];
}

const server = createServer(async (req, res) => {
  try {
    const requestPath = sanitize(req.url ?? '/');
    const relativePath = requestPath === '/' ? '/index.html' : requestPath;
    const filePath = join(baseDir, relativePath);
    const data = await readFile(filePath);
    const type = mimeTypes[extname(filePath)] ?? 'application/octet-stream';
    res.setHeader('Content-Type', type);
    res.writeHead(200);
    res.end(data);
  } catch (error) {
    res.writeHead(404);
    res.end('Not found');
  }
});

async function capture() {
  await new Promise((resolveServer) => {
    server.listen(port, resolveServer);
  });

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(`http://127.0.0.1:${port}/?path=/story/${storyId}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(1000);

    await mkdir(outDir, { recursive: true });
    const screenshotPath = resolve(process.cwd(), outDir, `${storyId}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved Storybook screenshot to ${screenshotPath}`);

    await browser.close();
  } finally {
    await new Promise((resolveServer) => server.close(resolveServer));
  }
}

capture().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

