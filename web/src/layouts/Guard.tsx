import React, { useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import LoginPage from 'src/pages/login';

const Guard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const validateUser = async () => {
    try {
      // Check if user near location (e.g., hospital, cadt)
      const allowedLocations: { lat: number; lng: number; allowedDistance: number }[] = [
        { lat: 11.581396075915201, lng: 104.91654819669195, allowedDistance: 1000 }, // Calmette Hospital
        { lat: 11.654651435959629, lng: 104.91148097840758, allowedDistance: 1000 }, // CADT
      ];
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          console.log('Current location', currentLocation);
          let allowed = false;

          for (const location of allowedLocations) {
            const distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              location.lat,
              location.lng
            );
            if (distance <= location.allowedDistance) {
              allowed = true;
              break;
            }
          }

          if (!allowed) {
            console.log('User is not near the location');
            setNotAllowed(true);
            return;
          }
          console.log('User is near the location');
        },
        (err) => {
          console.log('Location error', err);
        }
      );

      // Check if token exists in cookie
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
    validateUser();
  }, []);

  if (notAllowed) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
        }}
      >
        You are not allowed to access this page
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default Guard;
