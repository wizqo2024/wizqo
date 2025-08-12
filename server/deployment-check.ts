
// Deployment verification utility
export function verifyDeploymentRoutes(app: any) {
  const routes: any[] = [];
  const routeStack = app._router?.stack || [];
  
  routeStack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push({
        method: Object.keys(middleware.route.methods)[0]?.toUpperCase(),
        path: middleware.route.path
      });
    }
  });

  const requiredRoutes = [
    { method: 'POST', path: '/api/hobby-plans' },
    { method: 'GET', path: '/api/hobby-plans' },
    { method: 'POST', path: '/api/generate-plan' },
    { method: 'POST', path: '/api/chat' },
    { method: 'GET', path: '/api/health' }
  ];

  const missingRoutes = requiredRoutes.filter(required => 
    !routes.some(route => 
      route.method === required.method && route.path === required.path
    )
  );

  if (missingRoutes.length > 0) {
    console.error('❌ DEPLOYMENT ERROR: Missing required routes:', missingRoutes);
    return false;
  }

  console.log('✅ DEPLOYMENT: All required routes are registered');
  console.log('📋 ROUTES:', routes);
  return true;
}
