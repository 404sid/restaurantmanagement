import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, EyeIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../services/staffService';
import toast from 'react-hot-toast';

interface StaffMember {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hire_date: string;
}

interface StaffForm extends Omit<StaffMember, 'id' | 'age'> {}

const initialFormState: StaffForm = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: 'Male',
  phone: '',
  email: '',
  department: 'Kitchen',
  position: '',
  salary: 0,
  hire_date: new Date().toISOString().split('T')[0],
};

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<StaffForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchStaff();
        setStaff(data);
      } catch (error) {
        console.error('Error loading staff data:', error);
        toast.error('Failed to load staff data');
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  const handleOpenCreateModal = () => {
    setCurrentStaff(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEditModal = (staffMember: StaffMember) => {
    setCurrentStaff(staffMember);
    const { id, age, ...rest } = staffMember;
    setFormData(rest);
    setModalOpen(true);
  };

  const handleOpenViewModal = (staffMember: StaffMember) => {
    setCurrentStaff(staffMember);
    setViewModalOpen(true);
  };

  const handleOpenDeleteModal = (staffMember: StaffMember) => {
    setCurrentStaff(staffMember);
    setDeleteModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (currentStaff) {
        // Update existing staff
        await updateStaff(currentStaff.id, formData);
        setStaff(staff.map(s => s.id === currentStaff.id ? { ...s, ...formData } : s));
        toast.success('Staff member updated successfully');
      } else {
        // Create new staff
        const newStaff = await createStaff(formData);
        setStaff([...staff, newStaff]);
        toast.success('Staff member created successfully');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error(currentStaff ? 'Failed to update staff member' : 'Failed to create staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentStaff) return;
    
    setIsSubmitting(true);
    try {
      await deleteStaff(currentStaff.id);
      setStaff(staff.filter(s => s.id !== currentStaff.id));
      toast.success('Staff member deleted successfully');
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Failed to delete staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Staff</span>
        </button>
      </div>

      <DataTable
        columns={[
          { 
            header: 'Name', 
            accessor: (row) => `${row.first_name} ${row.last_name}` 
          },
          { header: 'Department', accessor: 'department' },
          { header: 'Position', accessor: 'position' },
          { 
            header: 'Contact', 
            accessor: (row) => (
              <div>
                <div>{row.phone}</div>
                <div className="text-xs text-gray-500">{row.email}</div>
              </div>
            )
          },
          {
            header: 'Salary',
            accessor: (row) => `$${row.salary.toLocaleString()}`,
          },
          {
            header: 'Actions',
            accessor: (row) => (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenViewModal(row);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon size={18} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(row);
                  }}
                  className="p-1 text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteModal(row);
                  }}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ),
          },
        ]}
        data={staff}
        onRowClick={handleOpenViewModal}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="select"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="select"
                required
              >
                <option value="Management">Management</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Service">Service</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="input"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date
              </label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </div>
              ) : currentStaff ? (
                'Update Staff'
              ) : (
                'Add Staff'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Staff Details"
        size="md"
      >
        {currentStaff && (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                {currentStaff.first_name.charAt(0)}{currentStaff.last_name.charAt(0)}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center">
              {currentStaff.first_name} {currentStaff.last_name}
            </h2>
            <p className="text-gray-500 text-center">{currentStaff.position}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{currentStaff.department}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{currentStaff.age}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentStaff.email || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{currentStaff.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium">${currentStaff.salary.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="font-medium">{new Date(currentStaff.hire_date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenEditModal(currentStaff);
                }}
                className="btn btn-outline"
              >
                <Edit size={18} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenDeleteModal(currentStaff);
                }}
                className="btn btn-error"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        {currentStaff && (
          <div>
            <p className="mb-4">
              Are you sure you want to delete {currentStaff.first_name} {currentStaff.last_name}? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffManagement;