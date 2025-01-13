import { Navigate, useRoutes } from 'react-router-dom';
// config
//

import HomePage from 'src/pages';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <HomePage />,
    },

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
