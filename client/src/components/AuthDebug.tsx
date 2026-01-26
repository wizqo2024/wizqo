import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export function AuthDebug() {
  const { user, loading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded text-xs max-w-xs z-50">
      <div>Auth Loading: {loading ? 'true' : 'false'}</div>
      <div>Authenticated: {user ? 'true' : 'false'}</div>
      <div>User Email: {user?.email || 'none'}</div>
      <div>User ID: {user?.id ? user.id.slice(0, 8) + '...' : 'none'}</div>
    </div>
  );
}