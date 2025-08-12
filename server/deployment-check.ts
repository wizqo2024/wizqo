// Deployment verification utility
export function verifyDeploymentRoutes(app: any) {
  console.log('🔍 DEPLOYMENT CHECK: Verifying critical routes are registered');

  const routes: string[] = [];

  // Extract routes from the app
  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
        routes.push(`${methods} ${middleware.route.path}`);
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
            routes.push(`${methods} ${handler.route.path}`);
          }
        });
      }
    });
  }

  console.log('🔍 DEPLOYMENT CHECK: Found routes:', routes);

  // Check for critical routes
  const criticalRoutes = [
    'POST /api/hobby-plans',
    'GET /api/hobby-plans', 
    'POST /api/generate-plan',
    'GET /api/health'
  ];

  const missingRoutes = criticalRoutes.filter(route => !routes.includes(route));

  if (missingRoutes.length > 0) {
    console.error('❌ DEPLOYMENT CHECK: Missing critical routes:', missingRoutes);
  } else {
    console.log('✅ DEPLOYMENT CHECK: All critical routes are registered');
  }

  return {
    registeredRoutes: routes,
    missingRoutes,
    isValid: missingRoutes.length === 0
  };
}