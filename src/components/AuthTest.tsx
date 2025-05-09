/**
 * AuthTest component - DISABLED
 * This was a test component for Clerk authentication.
 * Currently commented out to prevent errors.
 */

/*
'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

type AuthTestProps = {
  disabled?: boolean;
};

export default function AuthTest({ disabled = false }: AuthTestProps) {
  // If disabled, render a placeholder without using Clerk hooks
  if (disabled) {
    return (
      <div className="my-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Auth Status Test (Disabled)</h2>
        <div className="p-4 bg-gray-100 text-gray-500 rounded mb-4">
          Auth test component is currently disabled.
        </div>
      </div>
    );
  }

  // Otherwise, proceed with normal functionality
  try {
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const { user } = useUser();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
      // Demo fetching a token
      if (isLoaded && userId) {
        getToken().then(fetchedToken => {
          if (fetchedToken) {
            setToken(fetchedToken.substring(0, 20) + '...');
          }
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
  } catch (error) {
    return (
      <div className="my-8 p-6 border rounded-lg bg-red-50">
        <h2 className="text-xl font-bold mb-4 text-red-800">Auth Component Error</h2>
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          This component must be used within the ClerkProvider context.
          Make sure this component is only rendered on pages under the RootLayout.
        </div>
        <div className="text-sm mt-2">
          <a href="https://clerk.com/docs/components/clerk-provider" className="text-blue-600 underline">
            Learn more about ClerkProvider
          </a>
        </div>
      </div>
    );
  }
}
*/

// Export a dummy component to avoid import errors
export default function AuthTest() {
  return null;
} 