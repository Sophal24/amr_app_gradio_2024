import React from 'react';
import LoginPage from 'src/pages/login';

const Guard = ({ children }: { children: React.ReactNode }) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  let isAuthenticated = !!token;

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      isAuthenticated = false;
      window.location.reload();
    }
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default Guard;
