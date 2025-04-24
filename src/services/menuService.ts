import { mockMenuData } from '../data/mockData';

// In a real application, these would make API calls to the backend

export interface MenuItem {
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

let menuData = [...mockMenuData];

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return menuData;
};

export const getMenuItemById = async (id: number): Promise<MenuItem | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return menuData.find(item => item.id === id);
};

export const createMenuItem = async (item: MenuItemForm): Promise<MenuItem> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create new item with ID
  const newItem: MenuItem = {
    ...item,
    id: Math.max(0, ...menuData.map(i => i.id)) + 1
  };
  
  menuData.push(newItem);
  return newItem;
};

export const updateMenuItem = async (id: number, item: MenuItemForm): Promise<MenuItem> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const updatedItem: MenuItem = {
    ...item,
    id
  };
  
  menuData = menuData.map(i => i.id === id ? updatedItem : i);
  return updatedItem;
};

export const deleteMenuItem = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  menuData = menuData.filter(item => item.id !== id);
};