import React from 'react';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';

const Reports: React.FC = () => {
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [4500, 5200, 4800, 5800, 6000, 6500],
  };

  const categoryData = {
    labels: ['Food', 'Beverages', 'Desserts', 'Others'],
    data: [45, 25, 20, 10],
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <select className="select max-w-xs">
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <BarChart
            title="Monthly Sales"
            labels={salesData.labels}
            datasets={[
              {
                label: 'Sales',
                data: salesData.data,
                backgroundColor: 'rgba(125, 31, 44, 0.6)',
              },
            ]}
          />
        </div>

        <div className="card">
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
                  'rgba(59, 130, 246, 0.8)',
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;