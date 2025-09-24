// src/store/usersStore.ts
import { create } from "zustand";
import type { User, CreateUserDto } from "../types";

const API_URL = "https://supercultivated-neumic-rose.ngrok-free.dev/users";

interface UsersStore {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (userData: CreateUserDto) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],

  fetchUsers: async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      set({ users: Array.isArray(data) ? data : data.users });
    } catch (err) {
      console.error("❌ Fetch users error:", err);
    }
  },

  addUser: async (userData: CreateUserDto) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Failed to add user");
      const newUser: User = await res.json();
      set({ users: [...get().users, newUser] });
      alert("✅ Foydalanuvchi qo‘shildi!");
    } catch (err) {
      console.error("❌ Add user error:", err);
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updatedUser: User = await res.json();
      set({
        users: get().users.map((u) => (u.id === id ? updatedUser : u)),
      });
      alert("✏️ Foydalanuvchi yangilandi!");
    } catch (err) {
      console.error("❌ Update user error:", err);
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      set({ users: get().users.filter((u) => u.id !== id) });
      alert("🗑️ Foydalanuvchi o‘chirildi!");
    } catch (err) {
      console.error("❌ Delete user error:", err);
    }
  },
}));
