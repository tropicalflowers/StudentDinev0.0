require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const http = require('http');
const { connectPrisma } = require('../config/prisma');

const BASE = process.argv[2] || null;

function request(base, method, path, body) {
  const url = new URL(`${base}${path}`);
  const payload = body ? JSON.stringify(body) : null;

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => {
          data += c;
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
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests(base) {
  const id = `REST_TEST_${Date.now()}`;

  const create = await request(base, 'POST', '/api/prisma/restaurants', {
    restaurantId: id,
    name: 'Prisma Test Café',
    cluster: 'North Campus',
    capacity: 40,
  });
  console.log('POST', create.status, create.body.success ? 'OK' : create.body);

  const list = await request(base, 'GET', '/api/prisma/restaurants');
  console.log('GET', list.status, 'count:', list.body.count);

  const update = await request(base, 'PUT', `/api/prisma/restaurants/${id}`, {
    isOpen: false,
    statusNote: 'Test closed',
  });
  console.log('PUT', update.status, update.body.success ? 'OK' : update.body);

  const del = await request(base, 'DELETE', `/api/prisma/restaurants/${id}`);
  console.log('DELETE', del.status, del.body.success ? 'OK' : del.body);

  return create.status === 201 && list.status === 200 && update.status === 200 && del.status === 200;
}

(async () => {
  const pgOk = await connectPrisma();
  if (!pgOk) {
    console.error('PostgreSQL not connected — set DATABASE_URL and retry');
    process.exit(1);
  }

  if (BASE) {
    const passed = await runTests(BASE);
    process.exit(passed ? 0 : 1);
    return;
  }

  const app = require('../app');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const passed = await runTests(base);
    server.close();
    process.exit(passed ? 0 : 1);
  } catch (err) {
    server.close();
    console.error(err);
    process.exit(1);
  }
})();
