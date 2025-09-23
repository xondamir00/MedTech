import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";

import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { User, LogOut, KeyRound } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout, changePassword } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword(currentPassword, newPassword);
      alert("Password changed successfully!");
      setOpenDialog(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Failed to change password");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-5 sm:px-6 lg:px-9">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
            MedTech
          </h1>

          {/* User menu */}
          {user && (
            <>
              <IconButton onClick={handleMenuOpen}>
                <User size={22} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <div className="flex flex-col ">
                    <span className="text-xl ">{user.role}</span>
                    <span className="font-medium text-xl">{user.email}</span>
                  </div>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setOpenDialog(true);
                    handleMenuClose();
                  }}
                >
                  <KeyRound size={16} className="mr-2" /> Change Password
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" /> Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};
