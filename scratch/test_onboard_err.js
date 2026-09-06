const { queryPostgres } = require('./apps/web/node_modules/@adsspot/api/dist/server');

async function test() {
  try {
    const cats = await queryPostgres('SELECT id, name FROM categories');
    console.log('Categories in DB:', cats?.rows);
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
