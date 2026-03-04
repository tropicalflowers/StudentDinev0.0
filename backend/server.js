const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/menu');
  console.log('  GET    /api/menu/:id');
  console.log('  POST   /api/menu');
  console.log('  PUT    /api/menu/:id');
  console.log('  DELETE /api/menu/:id');
  console.log('  GET    /api/orders');
  console.log('  GET    /api/orders/:id');
  console.log('  POST   /api/orders');
  console.log('  GET    /api/coupons');
  console.log('  POST   /api/coupons/validate');
});
