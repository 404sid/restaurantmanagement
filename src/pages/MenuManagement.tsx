import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, EyeIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/menuService';
import toast from 'react-hot-toast';

interface MenuItem {
  id: number;
  item_name: string;
  category: string;
  description: string;
  price: number;
  preparation_time: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  availability: boolean;
}

interface MenuItemForm extends Omit<MenuItem, 'id'> {}

const initialFormState: MenuItemForm = {
  item_name: '',
  category: 'Main Course',
  description: '',
  price: 0,
  preparation_time: 15,
  is_vegetarian: false,
  is_vegan: false,
  is_gluten_free: false,
  availability: true,
};

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItemForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const data = await fetchMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error('Error loading menu data:', error);
        toast.error('Failed to load menu data');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  const handleOpenCreateModal = () => {
    setCurrentItem(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setCurrentItem(item);
    setFormData(item);
    setModalOpen(true);
  };

  const handleOpenViewModal = (item: MenuItem) => {
    setCurrentItem(item);
    setViewModalOpen(true);
  };

  const handleOpenDeleteModal = (item: MenuItem) => {
    setCurrentItem(item);
    setDeleteModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (currentItem) {
        // Update existing menu item
        await updateMenuItem(currentItem.id, formData);
        setMenuItems(menuItems.map(item => item.id === currentItem.id ? { ...item, ...formData } : item));
        toast.success('Menu item updated successfully');
      } else {
        // Create new menu item
        const newItem = await createMenuItem(formData);
        setMenuItems([...menuItems, newItem]);
        toast.success('Menu item created successfully');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(currentItem ? 'Failed to update menu item' : 'Failed to create menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentItem) return;
    
    setIsSubmitting(true);
    try {
      await deleteMenuItem(currentItem.id);
      setMenuItems(menuItems.filter(item => item.id !== currentItem.id));
      toast.success('Menu item deleted successfully');
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const updatedItem = { ...item, availability: !item.availability };
      await updateMenuItem(item.id, updatedItem);
      setMenuItems(menuItems.map(i => i.id === item.id ? updatedItem : i));
      toast.success(`${item.item_name} is now ${updatedItem.availability ? 'available' : 'unavailable'}`);
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability');
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <div className="flex flex-wrap gap-2">
          <div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="select"
            >
              <option value="all">All Categories</option>
              <option value="Appetizer">Appetizers</option>
              <option value="Main Course">Main Courses</option>
              <option value="Dessert">Desserts</option>
              <option value="Beverage">Beverages</option>
              <option value="Side Dish">Side Dishes</option>
            </select>
          </div>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { 
            header: 'Item Name', 
            accessor: 'item_name',
            cell: (row) => (
              <div className="font-medium text-gray-900">{row.item_name}</div>
            )
          },
          { header: 'Category', accessor: 'category' },
          {
            header: 'Price',
            accessor: (row) => `$${row.price.toFixed(2)}`,
          },
          {
            header: 'Dietary',
            accessor: (row) => (
              <div className="flex flex-wrap gap-1">
                {row.is_vegetarian && (
                  <span className="badge badge-success">Vegetarian</span>
                )}
                {row.is_vegan && (
                  <span className="badge badge-primary">Vegan</span>
                )}
                {row.is_gluten_free && (
                  <span className="badge badge-secondary">Gluten-Free</span>
                )}
              </div>
            ),
          },
          {
            header: 'Status',
            accessor: (row) => (
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={row.availability}
                    onChange={() => toggleAvailability(row)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  {row.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
            ),
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
        data={filteredItems}
        onRowClick={handleOpenViewModal}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="select"
                required
              >
                <option value="Appetizer">Appetizer</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
                <option value="Side Dish">Side Dish</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input h-24 resize-none"
                placeholder="Enter a description for this menu item..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                name="preparation_time"
                value={formData.preparation_time}
                onChange={handleInputChange}
                className="input"
                required
                min="1"
                step="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <label className="relative inline-flex items-center cursor-pointer mt-2">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {formData.availability ? 'Available' : 'Unavailable'}
                </span>
              </label>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Options
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_vegetarian"
                    checked={formData.is_vegetarian}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <span className="ml-2">Vegetarian</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_vegan"
                    checked={formData.is_vegan}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <span className="ml-2">Vegan</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_gluten_free"
                    checked={formData.is_gluten_free}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <span className="ml-2">Gluten-Free</span>
                </label>
              </div>
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
              ) : currentItem ? (
                'Update Item'
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Menu Item Details"
        size="md"
      >
        {currentItem && (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                {/* Icon based on category */}
                {currentItem.category === 'Appetizer' && '🍽️'}
                {currentItem.category === 'Main Course' && '🍲'}
                {currentItem.category === 'Dessert' && '🍰'}
                {currentItem.category === 'Beverage' && '🥤'}
                {currentItem.category === 'Side Dish' && '🥗'}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center">
              {currentItem.item_name}
            </h2>
            <p className="text-gray-500 text-center">{currentItem.category}</p>
            
            <div className="flex justify-center gap-2 my-4">
              {currentItem.is_vegetarian && (
                <span className="badge badge-success">Vegetarian</span>
              )}
              {currentItem.is_vegan && (
                <span className="badge badge-primary">Vegan</span>
              )}
              {currentItem.is_gluten_free && (
                <span className="badge badge-secondary">Gluten-Free</span>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{currentItem.description || 'No description available.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">${currentItem.price.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Prep Time</p>
                <p className="font-medium">{currentItem.preparation_time} minutes</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${currentItem.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {currentItem.availability ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenEditModal(currentItem);
                }}
                className="btn btn-outline"
              >
                <Edit size={18} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenDeleteModal(currentItem);
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
        {currentItem && (
          <div>
            <p className="mb-4">
              Are you sure you want to delete <span className="font-medium">{currentItem.item_name}</span>? This action cannot be undone.
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

export default MenuManagement;