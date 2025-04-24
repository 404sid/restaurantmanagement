import React, { useState, useEffect } from 'react';
import { DollarSign, Users, ShoppingBag, Calendar, TrendingUp, BarChart2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import DataTable from '../components/DataTable';
import { fetchDashboardData } from '../services/dashboardService';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { stats, salesData, categoryData, recentOrders } = dashboardData;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <select className="select max-w-xs">
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week" selected>This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-primary">
            <TrendingUp size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<DollarSign size={24} className="text-primary-600" />}
          change={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Staff Members"
          value={stats.staffCount}
          icon={<Users size={24} className="text-secondary-600" />}
        />
        <StatCard
          title="Total Orders"
          value={stats.orderCount}
          icon={<ShoppingBag size={24} className="text-accent-500" />}
          change={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Reservations"
          value={stats.reservationCount}
          icon={<Calendar size={24} className="text-success-500" />}
          change={{ value: 3.4, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChart
            title="Revenue & Orders"
            labels={salesData.labels}
            datasets={[
              {
                label: 'Revenue',
                data: salesData.revenue,
                backgroundColor: 'rgba(125, 31, 44, 0.6)',
              },
              {
                label: 'Orders',
                data: salesData.orders,
                backgroundColor: 'rgba(125, 157, 127, 0.6)',
              },
            ]}
            height={300}
          />
        </div>
        <div>
          <PieChart
            title="Sales by Category"
            labels={categoryData.labels}
            datasets={[
              {
                data: categoryData.data,
                backgroundColor: [
                  'rgba(125, 31, 44, 0.8)',
                  'rgba(125, 157, 127, 0.8)',
                  'rgba(232, 197, 71, 0.8)',
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                ],
              },
            ]}
            height={300}
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <DataTable
          title="Recent Orders"
          columns={[
            { header: 'Order ID', accessor: 'id' },
            { header: 'Customer', accessor: 'customer' },
            { header: 'Date', accessor: 'date' },
            {
              header: 'Status',
              accessor: 'status',
              cell: (row) => (
                <span
                  className={`badge ${
                    row.status === 'Completed'
                      ? 'badge-success'
                      : row.status === 'Pending'
                      ? 'badge-warning'
                      : row.status === 'Cancelled'
                      ? 'badge-error'
                      : 'badge-primary'
                  }`}
                >
                  {row.status}
                </span>
              ),
            },
            {
              header: 'Amount',
              accessor: 'amount',
              cell: (row) => <span className="font-medium">${row.amount}</span>,
            },
            {
              header: 'Actions',
              accessor: (row) => (
                <div className="flex items-center space-x-2">
                  <button className="btn btn-sm btn-outline">View</button>
                </div>
              ),
            },
          ]}
          data={recentOrders}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
