import { Navigate, useRoutes } from 'react-router-dom';
import Guard from 'src/layouts/Guard';
// config
//

import HomePage from 'src/pages';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <Guard>
          <HomePage />
        </Guard>
      ),
    },

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
