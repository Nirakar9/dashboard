import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../lib/auth-context';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-4 py-6">
        <h1 className="text-2xl font-bold mb-8"> Admin Panel</h1>
        <div className="space-y-2">
          <Button
            variant="default"
            className="w-full justify-start"
            onClick={() => navigate('/dashboard')}
          >
            Home
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => navigate('/appointments')}
          >
            Manage Appointments
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <h2 className="text-3xl font-semibold mb-6">Welcome</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">23</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
