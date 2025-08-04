import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AuthTestPage() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleAuth = async () => {
    setTestLoading(true);
    setLastResult(null);
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, username);
      } else {
        result = await signIn(email, password);
      }
      setLastResult(result);
      console.log('Auth result:', result);
    } catch (error) {
      console.error('Auth error:', error);
      setLastResult({ error });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Debug authentication flow
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current User State:
              </label>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify({ user: user?.email || 'null', loading }, null, 2)}
              </pre>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => setIsSignUp(false)}
                variant={!isSignUp ? 'default' : 'outline'}
                size="sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setIsSignUp(true)}
                variant={isSignUp ? 'default' : 'outline'}
                size="sm"
              >
                Sign Up
              </Button>
            </div>

            {isSignUp && (
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password (6+ chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />

            <Button
              onClick={handleAuth}
              disabled={testLoading || !email || !password || (isSignUp && !username)}
              className="w-full"
            >
              {testLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>

            {user && (
              <Button
                onClick={signOut}
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
            )}

            {lastResult && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Result:
                </label>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(lastResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <a href="#/" className="text-purple-600 hover:text-purple-500">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}