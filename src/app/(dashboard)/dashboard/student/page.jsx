"use client";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  LayoutDashboard, 
  LogOut, 
  Search,
  Bell,
  Settings
} from "lucide-react";
import Cookies from "js-cookie";

export default function StudentDashboard() {
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
          <Link href="/dashboard/student" className="flex items-center rounded-xl bg-indigo-50 px-4 py-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 cursor-pointer">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <a href="#courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all dark:text-gray-400 dark:hover:bg-gray-800/50 cursor-pointer">
            <BookOpen size={20} />
            <span className="font-medium text-sm">My Courses</span>
          </a>
          <a href="#" className="flex items-center rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all cursor-pointer">
            <Search className="mr-3 h-5 w-5" />
            Explore
          </a>
          <a href="#" className="flex items-center rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all cursor-pointer">
            <Settings className="mr-3 h-5 w-5" />
            Settings
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
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
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
              Welcome back, {user?.displayName || "Learner"}! 👋
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Master new skills and track your progress.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
              <div className="flex items-center">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <BookOpen size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
              <div className="flex items-center">
                <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                  <Clock size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hours Studied</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12.5</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111]">
              <div className="flex items-center">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Trophy size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12" id="courses">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Continue Learning</h3>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">View All</button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <div key={i} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-[#111] cursor-pointer">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10"></div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">Course Title {i}</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Next module starts in 2 days</p>
                    <div className="mt-4">
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-2 rounded-full bg-indigo-600" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
