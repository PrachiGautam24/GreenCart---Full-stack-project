import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import ContentModeration from '../components/admin/ContentModeration';

const AdminPage = () => {
  const { user } = useSelector((state) => state.auth);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage users and moderate platform content
          </p>
        </div>

        <div className="space-y-8">
          <UserManagement />
          <ContentModeration />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
