import { mockStaffData } from '../data/mockData';

// In a real application, these would make API calls to the backend

export interface StaffMember {
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

let staffData = [...mockStaffData];

export const fetchStaff = async (): Promise<StaffMember[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return staffData;
};

export const getStaffById = async (id: number): Promise<StaffMember | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return staffData.find(staff => staff.id === id);
};

export const createStaff = async (staff: StaffForm): Promise<StaffMember> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate age from date of birth
  const birthDate = new Date(staff.date_of_birth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  // Create new staff with ID
  const newStaff: StaffMember = {
    ...staff,
    id: Math.max(0, ...staffData.map(s => s.id)) + 1,
    age
  };
  
  staffData.push(newStaff);
  return newStaff;
};

export const updateStaff = async (id: number, staff: StaffForm): Promise<StaffMember> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate age from date of birth
  const birthDate = new Date(staff.date_of_birth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  const updatedStaff: StaffMember = {
    ...staff,
    id,
    age
  };
  
  staffData = staffData.map(s => s.id === id ? updatedStaff : s);
  return updatedStaff;
};

export const deleteStaff = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  staffData = staffData.filter(staff => staff.id !== id);
};