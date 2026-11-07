import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { NotFound } from './pages/NotFound';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'privacy-policy',
        element: <Navigate to="/privacy" replace />,
      },
      {
        path: 'terms',
        element: <TermsAndConditions />,
      },
      {
        path: 'terms-and-conditions',
        element: <Navigate to="/terms" replace />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
