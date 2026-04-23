"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Heart,
  PlayCircle,
  Bell,
  GraduationCap,
  X,
  User,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function DashboardSidebar({ role, isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("session");
      Cookies.remove("user-role");
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchView = async () => {
    const newRole = role === "instructor" ? "student" : "instructor";
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), { role: newRole });
        Cookies.set("user-role", newRole);
        toast.success(`Switched to ${newRole} view`);
        router.replace(`/dashboard/${newRole}`);
      }
    } catch (err) {
      toast.error("Failed to switch view");
    }
  };

  const instructorLinks = [
    { name: "Dashboard", href: "/dashboard/instructor", icon: LayoutDashboard },
    { name: "Courses", href: "/dashboard/instructor#courses", icon: BookOpen },
    { name: "Students", href: "/dashboard/instructor#students", icon: Users },
    { name: "Analytics", href: "/dashboard/instructor#analytics", icon: BarChart3 },
    { name: "Profile", href: "/dashboard/instructor/profile", icon: User },
  ];

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "My Learning", href: "/dashboard/student/learning", icon: PlayCircle },
    { name: "Profile", href: "/dashboard/student/profile", icon: User },
  ];

  const links = role === "instructor" ? instructorLinks : studentLinks;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed z-50 h-full w-72 flex flex-col bg-white dark:bg-[#0A0A0A] border-r border-gray-100 dark:border-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="h-24 flex items-center px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <GraduationCap size={22} />
            </div>
            <span className="text-2xl font-black tracking-tight text-indigo-600 dark:text-white">EduCore</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-6 py-4">
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 group",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-600/10 dark:text-indigo-400" 
                      : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <link.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-300 dark:text-gray-600")} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6 space-y-4">
          <button 
            onClick={handleSwitchView}
            className="flex w-full items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-600/10 dark:text-indigo-400 border border-transparent hover:border-indigo-600/20 transition-all"
          >
             <ShieldCheck size={18} />
             Switch to {role === "instructor" ? "Student" : "Instructor"}
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
