import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';

const Inventory: React.FC = () => {
  const [inventory] = useState([
    { id: 1, item: 'Tomatoes', quantity: 50, unit: 'kg', status: 'In Stock' },
    { id: 2, item: 'Chicken', quantity: 30, unit: 'kg', status: 'Low Stock' },
  ]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      <DataTable
        columns={[
          { header: 'Item ID', accessor: 'id' },
          { header: 'Item Name', accessor: 'item' },
          { 
            header: 'Quantity', 
            accessor: (row) => `${row.quantity} ${row.unit}` 
          },
          {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
              <span className={`badge ${
                row.status === 'In Stock' ? 'badge-success' : 'badge-warning'
              }`}>
                {row.status}
              </span>
            ),
          },
        ]}
        data={inventory}
      />
    </div>
  );
};

export default Inventory;