import React, { useState } from 'react';
import { useUsersStore } from '../../store/usersStore';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { UserPlus, Edit, Trash2, ChevronDown } from 'lucide-react';
import { type User } from '../../types';
import { validateEmail, validatePassword, getRoleDisplayName } from '../../utils/helpers';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export const AdminPanel = () => {
  const { users, addUser, updateUser, deleteUser } = useUsersStore();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openRoleMenu, setOpenRoleMenu] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor' as 'doctor' | 'reception'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (users.some(user => user.email === formData.email && user.id !== editingUser?.id)) {
      newErrors.email = 'Email already exists';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    handleCloseModal();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role as 'doctor' | 'reception'
    });
    setShowModal(true);
  };

  const handleDelete = (userId: string) => {
    setDeleteId(userId);
    setConfirmOpen(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'doctor' });
    setErrors({});
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'password', label: 'Password' },
    { key: 'role', label: 'Role', render: (value: string) => getRoleDisplayName(value) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: User) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)} className="flex items-center space-x-1">
            <Edit size={16} />
            <span>Edit</span>
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} className="flex items-center space-x-1">
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <UserPlus size={20} />
            <span>Add New User</span>
          </Button>
        </div>
      </div>

      <Card title="All Users">
        {users.length > 0 ? (
          <Table data={users} columns={columns} />
        ) : (
          <p className="text-gray-500 text-center py-4">No users created yet</p>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter full name"
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="user@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Minimum 8 characters"
          />
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <button
              type="button"
              onClick={() => setOpenRoleMenu(!openRoleMenu)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
            >
              {formData.role === 'doctor' ? 'Doctor' : 'Reception'}
              <ChevronDown size={18} className="text-gray-500" />
            </button>
            {openRoleMenu && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: 'doctor' });
                    setOpenRoleMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg ${
                    formData.role === 'doctor' ? 'bg-gray-50 font-medium' : ''
                  }`}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: 'reception' });
                    setOpenRoleMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg ${
                    formData.role === 'reception' ? 'bg-gray-50 font-medium' : ''
                  }`}
                >
                  Reception
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingUser ? 'Update User' : 'Add User'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (deleteId) deleteUser(deleteId);
        }}
        title="Delete User"
        message="Do you really want to delete this user?"
      />
    </div>
  );
};
