import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';

const Reservations: React.FC = () => {
  const [reservations] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      date: '2024-03-25', 
      time: '19:00', 
      guests: 4, 
      status: 'Confirmed' 
    },
    { 
      id: 2, 
      name: 'Mary Johnson', 
      date: '2024-03-26', 
      time: '20:00', 
      guests: 2, 
      status: 'Pending' 
    },
  ]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span>New Reservation</span>
        </button>
      </div>

      <DataTable
        columns={[
          { header: 'ID', accessor: 'id' },
          { header: 'Guest Name', accessor: 'name' },
          { header: 'Date', accessor: 'date' },
          { header: 'Time', accessor: 'time' },
          { header: 'Guests', accessor: 'guests' },
          {
            header: 'Status',
            accessor: 'status',
            cell: (row) => (
              <span className={`badge ${
                row.status === 'Confirmed' ? 'badge-success' : 'badge-warning'
              }`}>
                {row.status}
              </span>
            ),
          },
        ]}
        data={reservations}
      />
    </div>
  );
};

export default Reservations;