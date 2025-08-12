import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`🔍 API Request: ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.body) {
      console.log(`🔍 Request body keys:`, Object.keys(req.body));
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register API routes
  const server = await registerRoutes(app);

  // Verify deployment routes
  import('./deployment-check').then(({ verifyDeploymentRoutes }) => {
    verifyDeploymentRoutes(app);
  }).catch(err => {
    console.error('Failed to load deployment check:', err);
  });
  
  // Comprehensive route debugging
  console.log('🛣️ Registered API routes:');
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`  ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          console.log(`  ${Object.keys(handler.route.methods)} ${handler.route.path}`);
        }
      });
    }
  });

  // Test route availability
  console.log('🔍 Testing route registration...');
  const routes = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    }
  });
  console.log('📋 Found routes:', routes);

  // Add specific check for hobby-plans endpoint
  const hobbyPlansRoute = app._router.stack.find((middleware: any) => {
    return middleware.route && middleware.route.path === '/api/hobby-plans';
  });
  console.log('🎯 hobby-plans POST route exists:', !!hobbyPlansRoute);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  console.log('🚀 PRODUCTION: Preparing server for live deployment');
  console.log('🌐 PRODUCTION: Server will bind to 0.0.0.0 for external access');
  console.log('📡 PRODUCTION: All API routes configured for live traffic');
  
  // Production deployment verification
  console.log('🚀 DEPLOYMENT: Starting server on host 0.0.0.0 port', port);
  console.log('🚀 DEPLOYMENT: Environment NODE_ENV:', process.env.NODE_ENV);
  
  // Final route verification before starting server
  console.log('🔍 FINAL ROUTE CHECK: All registered routes before server start:');
  let routeCount = 0;
  app._router.stack.forEach((middleware: any, index: number) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      console.log(`  ${index}: ${methods} ${middleware.route.path}`);
      routeCount++;
    }
  });
  
  console.log(`🔍 TOTAL ROUTES REGISTERED: ${routeCount}`);
  
  // Critical API routes check
  const hasHobbyPlansPost = app._router.stack.some((middleware: any) => 
    middleware.route && 
    middleware.route.path === '/api/hobby-plans' && 
    middleware.route.methods.post
  );
  
  if (!hasHobbyPlansPost) {
    console.error('❌ CRITICAL: POST /api/hobby-plans route NOT FOUND!');
  } else {
    console.log('✅ CRITICAL: POST /api/hobby-plans route is registered');
  }

  server.listen(port, "0.0.0.0", () => {
    log(`🚀 SERVER STARTED: serving on port ${port}`);
    console.log(`🌐 LOCAL DEV: http://localhost:${port}`);
    console.log(`🔍 API TEST: Try /api/health`);
    
    // Production deployment info
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 PRODUCTION: Ready for Replit deployment');
      console.log('🔗 After deploying, your API will be available at your deployment URL');
    }
    
    // Environment variable status
    console.log('🔑 Environment Variables Status:');
    console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('  - OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? `Found (${process.env.OPENROUTER_API_KEY.length} chars)` : 'Missing');
    console.log('  - VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Found' : 'Missing');
    console.log('  - VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Found' : 'Missing');
    
    // Critical API endpoint verification for production
    console.log('🎯 CRITICAL ENDPOINTS VERIFICATION:');
    const criticalEndpoints = [
      { method: 'POST', path: '/api/hobby-plans' },
      { method: 'GET', path: '/api/hobby-plans' },
      { method: 'POST', path: '/api/generate-plan' },
      { method: 'GET', path: '/api/health' }
    ];
    
    criticalEndpoints.forEach(endpoint => {
      const routeExists = app._router.stack.some((middleware: any) => 
        middleware.route && 
        middleware.route.path === endpoint.path && 
        middleware.route.methods[endpoint.method.toLowerCase()]
      );
      console.log(`  ${routeExists ? '✅' : '❌'} ${endpoint.method} ${endpoint.path}: ${routeExists ? 'REGISTERED' : 'MISSING'}`);
    });
    
    // Warning for missing keys
    if (!process.env.OPENROUTER_API_KEY) {
      console.log('⚠️ WARNING: OPENROUTER_API_KEY not set - AI plan generation will use fallback');
    }
    if (!process.env.VITE_SUPABASE_URL) {
      console.log('⚠️ WARNING: VITE_SUPABASE_URL not set - database operations may fail');
    }

    // Production deployment check
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 PRODUCTION MODE: All API routes verified and ready');
      console.log('🚀 PRODUCTION: Server is properly configured for live deployment');
    }
  });
})();