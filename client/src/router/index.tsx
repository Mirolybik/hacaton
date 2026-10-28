
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { RequestsPage } from '../pages/RequestsPage';
import { EquipmentPage } from '../pages/EquipmentPage';
import { CreateRequestPage } from '../pages/CreateRequestPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'requests', element: <RequestsPage /> },
      { path: 'equipment', element: <EquipmentPage /> },
      { path: 'requests/new', element: <CreateRequestPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
