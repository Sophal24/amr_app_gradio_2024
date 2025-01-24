import React, { useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import LoginPage from 'src/pages/login';

const Guard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateToken = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      setIsAuthenticated(!!token);

      if (token) {
        console.log('Token found', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          setIsAuthenticated(false);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // if (!isAuthenticated) {
  //   return <LoginPage />;
  // }

  return <>{children}</>;
};

export default Guard;
