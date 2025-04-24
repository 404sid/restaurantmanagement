import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';

const OrderManagement: React.FC = () => {
  const [orders] = useState([
    { id: 1, customer: 'John Doe', items: 3, total: 45.99, status: 'Pending' },
    { id: 2, customer: 'Jane Smith', items: 2, total: 29.99, status: 'Completed' },
  ]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span>New Order</span>
        </button>
      </div>

      <DataTable
        columns={[
          { header: 'Order ID', accessor: 'id' },
          { header: 'Customer', accessor: 'customer' },
          { header: 'Items', accessor: 'items' },
          { 
            header: 'Total', 
            accessor: (row) => `$${row.total.toFixed(2)}` 
          },
          {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
              <span className={`badge ${
                row.status === 'Completed' ? 'badge-success' : 'badge-warning'
              }`}>
                {row.status}
              </span>
            ),
          },
        ]}
        data={orders}
      />
    </div>
  );
};

export default OrderManagement;