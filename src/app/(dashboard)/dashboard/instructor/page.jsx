"use client";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  PlusCircle, 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  BookOpen,
  Bell,
  Settings,
  Trophy
} from "lucide-react";
import Cookies from "js-cookie";

export default function InstructorDashboard() {
  const { user, loading } = useSelector((state) => state.auth);
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      {/* Sidebar */}
      <aside className="fixed hidden h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111] lg:flex">
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
          <Link href="/" className="text-2xl font-bold text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity">EduCore</Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <Link href="/dashboard/instructor" className="flex items-center rounded-xl bg-indigo-50 px-4 py-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 cursor-pointer">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all dark:text-gray-400 dark:hover:bg-gray-800/50 cursor-pointer">
            <BookOpen size={20} />
            <span className="font-medium text-sm">My Courses</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all dark:text-gray-400 dark:hover:bg-gray-800/50 cursor-pointer">
            <Users size={20} />
            <span className="font-medium text-sm">Students</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all dark:text-gray-400 dark:hover:bg-gray-800/50 cursor-pointer">
            <BarChart3 size={20} />
            <span className="font-medium text-sm">Analytics</span>
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
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Instructor Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all cursor-pointer">
              <PlusCircle size={18} />
              <span>Create Course</span>
            </button>
            <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        <section className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              Welcome back, Instructor {user?.displayName || ""}! 🚀
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your courses and engage with your students.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
               <div className="text-indigo-600 dark:text-indigo-400 mb-2">
                  <BookOpen size={24} />
               </div>
               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
               <div className="text-blue-600 dark:text-blue-400 mb-2">
                  <Users size={24} />
               </div>
               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">1,248</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
               <div className="text-orange-600 dark:text-orange-400 mb-2">
                  <Trophy size={24} />
               </div>
               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Course Rating</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Course Activity</h3>
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-[#111]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Course Name</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Enrolled</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium dark:text-white">Advanced React Patterns {i}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">324 students</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Published
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
