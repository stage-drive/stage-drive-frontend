import { Routes, Route } from 'react-router-dom';
import { OwnerDashboardPage } from '../../modules/dashboard/pages/OwnerDashboardPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerDashboardPage/>} />

      <Route path="*" element={<div>Сторінку не знайдено (404)</div>} />
    </Routes>
  );
};
