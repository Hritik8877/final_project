"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, getDocs, doc, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Bell,
  Settings,
  AlertCircle,
  Search,
  CheckCircle2,
  XCircle,
  PlusCircle
} from "lucide-react";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [filter, setFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("session");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      Cookies.remove("session");
      window.location.href = "/login";
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Protection
  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#0A0A0A] p-4 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold dark:text-white">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">You do not have permission to view the Admin Dashboard.</p>
        <Link href="/dashboard/student" className="mt-6 text-indigo-600 font-semibold hover:underline">Return to Dashboard</Link>
      </div>
    )
  }

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(filter.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      {/* Sidebar */}
      <aside className="fixed hidden h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111] lg:flex">
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
          <Link href="/" className="text-2xl font-bold text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity">EduCore</Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <Link href="/dashboard/admin" className="flex items-center rounded-xl bg-indigo-50 px-4 py-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 cursor-pointer">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <a href="#users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all dark:text-gray-400 dark:hover:bg-gray-800/50 cursor-pointer">
            <Users size={20} />
            <span className="font-medium text-sm">User Management</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all dark:text-gray-400 dark:hover:bg-gray-800/50 cursor-pointer">
            <ShieldCheck size={20} />
            <span className="font-medium text-sm">System Logs</span>
          </a>

        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-xl px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 transition-all cursor-pointer"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-gray-800 dark:bg-[#111]">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Control Center</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
              <CheckCircle2 size={14} />
              <span>System Online</span>
            </div>
            <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <section className="p-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Platform Overview</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Manage users, roles, and overall system performance.</p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 dark:bg-gray-800 dark:border-gray-700">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="bg-transparent border-none focus:ring-0 text-sm dark:text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-12">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Registered Users</p>
              <p className="text-4xl font-extrabold text-indigo-600 mt-2">12,842</p>
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <PlusCircle size={12} /> +12% this month
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Server Status</p>
              <p className="text-4xl font-extrabold text-blue-500 mt-2">99.9%</p>
              <p className="text-xs text-indigo-600 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> All systems operational
              </p>
            </div>
          </div>

          <div className="mt-12" id="users">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Management & Role Assignment</h3>
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-[#111] shadow-sm">
              {loadingUsers ? (
                <div className="p-12 text-center text-gray-500">Loading user database...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Role</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-indigo-600 border border-indigo-100 dark:border-indigo-900/40 capitalize">
                              {u.displayName?.charAt(0) || u.email?.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{u.displayName || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${u.role === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            u.role === "instructor" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" :
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}>
                            {u.role || "student"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <select
                              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-indigo-500"
                              value={u.role || "student"}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            >
                              <option value="student">Student</option>
                              <option value="instructor">Instructor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">No users found matching your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
