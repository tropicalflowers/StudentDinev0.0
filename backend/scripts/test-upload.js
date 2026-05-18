/**
 * Smoke test for POST /api/upload
 * Usage: node scripts/test-upload.js [baseUrl]
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE = process.argv[2] || null;

// 1x1 PNG
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAD0lEQVQ42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function multipartBody(fieldName, filename, buffer, mime) {
  const boundary = `----UploadTest${Date.now()}`;
  const parts = [
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\n`,
    `Content-Type: ${mime}\r\n\r\n`,
  ];
  const tail = `\r\n--${boundary}--\r\n`;
  return {
    boundary,
    body: Buffer.concat([
      Buffer.from(parts.join('')),
      buffer,
      Buffer.from(tail),
    ]),
  };
}

function postUpload(base, filename, buffer, mime) {
  const url = new URL(`${base}/api/upload`);
  const { boundary, body } = multipartBody('file', filename, buffer, mime);

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runWithBase(base) {
  const png = Buffer.from(PNG_BASE64, 'base64');

  console.log('Testing', base);
  console.log('1) Valid PNG upload...');
  const ok = await postUpload(base, 'test.png', png, 'image/png');
  console.log('   ', ok.status, ok.body);

  console.log('2) Invalid type (.txt)...');
  const bad = await postUpload(base, 'test.txt', Buffer.from('hello'), 'text/plain');
  console.log('   ', bad.status, bad.body);

  console.log('3) Missing file field...');
  const url = new URL(`${base}/api/upload`);
  const missing = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': 2 },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => {
          data += c;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        });
      }
    );
    req.on('error', reject);
    req.write('{}');
    req.end();
  });
  console.log('   ', missing.status, missing.body);

  const passed =
    ok.status === 201 &&
    ok.body.success === true &&
    ok.body.filename &&
    ok.body.filepath &&
    fs.existsSync(path.join(__dirname, '..', 'uploads', ok.body.filename));

  console.log(passed ? '\nAll upload checks passed.' : '\nUpload check failed.');
  return passed;
}

async function run() {
  if (BASE) {
    const passed = await runWithBase(BASE);
    process.exit(passed ? 0 : 1);
    return;
  }

  const http = require('http');
  const app = require('../app');
  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.listen(0, resolve);
    server.on('error', reject);
  });

  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const passed = await runWithBase(base);
    server.close();
    process.exit(passed ? 0 : 1);
  } catch (err) {
    server.close();
    throw err;
  }
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
