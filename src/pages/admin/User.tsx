import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button as MuiButton,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { type User } from "../../types";
import {
  getRoleDisplayName,
  validateEmail,
  validatePassword,
} from "../../utils/helpers";
import { Table } from "../../components/ui/Table";
import { ConfirmModal } from "../../components/ui/confirmModal";
import { useUsersStore } from "../../store/usersStore";
import { Card } from "../../components/ui/Card";
import { Edit, Trash2, UserPlus } from "lucide-react";

const UserPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { deleteUser, users, addUser, updateUser } = useUsersStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor" as "doctor" | "reception",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (
      users.some(
        (user) => user.email === formData.email && user.id !== editingUser?.id
      )
    ) {
      newErrors.email = "Email already exists";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
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

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "doctor" });
    setErrors({});
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role as "doctor" | "reception",
    });
    setShowModal(true);
  };

  const handleDelete = (userId: string) => {
    setDeleteId(userId);
    setConfirmOpen(true);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    {
      key: "role",
      label: "Role",
      render: (value: string) => getRoleDisplayName(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row: User) => (
        <div className="flex flex-wrap justify-end gap-1">
          <MuiButton
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleEdit(row)}
            startIcon={<Edit size={16} />}
          >
            Edit
          </MuiButton>
          <MuiButton
            size="small"
            color="error"
            variant="contained"
            onClick={() => handleDelete(row.id)}
            startIcon={<Trash2 size={16} />}
          >
            Delete
          </MuiButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          User Management
        </h1>
        <MuiButton
          variant="contained"
          color="primary"
          startIcon={<UserPlus size={20} />}
          onClick={() => setShowModal(true)}
        >
          Add New User
        </MuiButton>
      </div>

      <Card title="All Users">
        {users.length > 0 ? (
          <Table data={users} columns={columns} />
        ) : (
          <p className="text-gray-500 text-center py-4">No users created yet</p>
        )}
      </Card>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (deleteId) deleteUser(deleteId);
          setConfirmOpen(false);
        }}
        title="Delete User"
        message="Do you really want to delete this user?"
      />

      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogTitle>
          {editingUser ? "Edit User" : "Add New User"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="space-y-4">
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              sx={{marginY:1}}
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
                sx={{marginY:1}}
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
                sx={{marginY:1}}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              select
              fullWidth
                sx={{marginY:1}}
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="reception">Reception</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions
            sx={{
              padding: theme.spacing(2),
              display: "flex",
              flexDirection: fullScreen ? "column" : "row",
              gap: 1,
            }}
          >
            <MuiButton
              onClick={handleCloseModal}
              variant="contained"
              color="error"
              fullWidth={fullScreen}
            >
              Cancel
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth={fullScreen}
            >
              {editingUser ? "Update User" : "Add User"}
            </MuiButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UserPage;
