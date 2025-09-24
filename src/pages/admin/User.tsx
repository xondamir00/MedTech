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
import { type User, type CreateUserDto } from "../../types";
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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "DOCTOR" as "DOCTOR" | "RECEPTION",
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
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
const payload: CreateUserDto = {
  email: formData.email,
  firstName: formData.firstName,
  lastName: formData.lastName,
  role: formData.role,
  temporaryPassword: formData.password,
};


    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await addUser(payload);
      }
      handleCloseModal();
    } catch (err) {
      console.error("User save error:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "DOCTOR",
    });
    setErrors({});
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.temporaryPassword || "",
      role: user.role as "DOCTOR" | "RECEPTION",
    });
    setShowModal(true);
  };

  const handleDelete = (userId: string) => {
    setDeleteId(userId);
    setConfirmOpen(true);
  };

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
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

      {/* Modal */}
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
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="DOCTOR">Doctor</MenuItem>
              <MenuItem value="RECEPTION">Reception</MenuItem>
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
