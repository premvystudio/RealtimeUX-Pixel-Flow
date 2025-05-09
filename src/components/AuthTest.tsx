'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function AuthTest() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Demo fetching a token
    if (isLoaded && userId) {
      getToken().then(fetchedToken => {
        setToken(fetchedToken?.substring(0, 20) + '...');
      });
    }
  }, [isLoaded, userId, getToken]);

  if (!isLoaded) {
    return <div>Loading auth...</div>;
  }

  return (
    <div className="my-8 p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Auth Status Test</h2>
      
      {!userId ? (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
          You are not signed in. Use the Sign In or Sign Up buttons above.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 text-green-800 rounded">
            ✅ You are authenticated!
          </div>
          
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="border-b pb-2">
              <span className="font-semibold">User ID:</span> {userId}
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold">Session ID:</span> {sessionId}
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold">Name:</span> {user?.fullName || 'N/A'}
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold">Email:</span> {user?.primaryEmailAddress?.emailAddress || 'N/A'}
            </div>
            
            {token && (
              <div className="border-b pb-2">
                <span className="font-semibold">Auth Token:</span> <code className="bg-gray-100 px-1 py-0.5 rounded">{token}</code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 