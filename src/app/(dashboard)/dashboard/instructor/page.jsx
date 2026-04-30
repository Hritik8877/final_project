/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setCourses, setCourseLoading } from "@/redux/slices/courseSlice";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Users, 
  PlusCircle, 
  BarChart3, 
  LayoutDashboard, 
  LogOut, 
  BookOpen,
  Bell,
  Edit2,
  Trash2,
  Loader2,
  Trophy,
  Menu,
  X,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Star
} from "lucide-react";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardSidebar from "@/components/DashboardSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { sanitizeFirestoreData } from "@/lib/firebaseUtils";

const AnalyticsChart = dynamic(() => import("@/components/AnalyticsChart"), {
  ssr: false,
  loading: () => <div className="flex h-[300px] items-center justify-center text-gray-500">Loading charts...</div>
});

const CourseModal = dynamic(() => import("@/components/CourseModal"), {
  ssr: false
});

export default function InstructorDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses, loading } = useSelector((state) => state.course);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user?.uid) return;

    dispatch(setCourseLoading(true));
    const q = query(collection(db, "courses"), where("instructorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => sanitizeFirestoreData({ id: doc.id, ...doc.data() }));
      dispatch(setCourses(data));
      dispatch(setCourseLoading(false));
    });

    return () => unsubscribe();
  }, [user, dispatch]);

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        const docRef = doc(db, "courses", editingCourse.id);
        await updateDoc(docRef, { ...courseData, updatedAt: serverTimestamp() });
        toast.success("Course upgraded successfully!");
      } else {
        await addDoc(collection(db, "courses"), {
          ...courseData,
          instructorId: user.uid,
          instructorName: user.displayName,
          students: 0,
          rating: 5.0,
          createdAt: serverTimestamp()
        });
        toast.success("New course deployed!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Operation failed");
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (confirm("Are you sure? This will delete all course intelligence.")) {
      try {
        await deleteDoc(doc(db, "courses", id));
        toast.success("Course terminated");
      } catch (err) {
        toast.error("Deletion failed");
      }
    }
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.students || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.students * (parseFloat(c.price) || 0)), 0);

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0A0A0A]">
      <DashboardSidebar role="instructor" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 lg:ml-72 transition-all duration-300">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-10 dark:border-gray-900 dark:bg-[#0A0A0A]/80">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          </div>

          {/* Search Bar (Middle) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
             <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Search courses, students, analytics..." 
               className="w-full pl-12 pr-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
             />
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="relative p-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
               <Bell size={22} />
               <span className="absolute top-3.5 right-3.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#0A0A0A]"></span>
            </button>
            <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-900 hidden sm:block"></div>
            <div className="flex items-center gap-4">
               <div className="hidden text-right lg:block">
                  <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{user?.displayName}</p>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Instructor</p>
               </div>
               <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/20">
                  {user?.displayName?.[0]}
               </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {/* Action Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
             <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Welcome back, {user?.displayName?.split(' ')[0]} 👋</h2>
                <p className="text-gray-500 font-medium">Your courses are performing 12% better than last month.</p>
             </div>
             <button 
               onClick={() => { setEditingCourse(null); setIsModalOpen(true); }}
               className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all"
             >
               <PlusCircle size={20} />
               Deploy New Course
             </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Students", value: totalStudents.toLocaleString(), icon: <Users size={24} />, color: "bg-blue-500", trend: "+8.2%" },
              { label: "Active Courses", value: courses.length, icon: <BookOpen size={24} />, color: "bg-indigo-600", trend: "+2" },
              { label: "Average Rating", value: "4.9", icon: <Star size={24} />, color: "bg-amber-500", trend: "+0.1" },
              { label: "Gross Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: "bg-emerald-500", trend: "+15.4%" },
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800 hover:border-indigo-600/30 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                     <TrendingUp size={12} />
                     {stat.trend}
                  </div>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">{stat.value}</h4>
              </motion.div>
            ))}
          </div>

          {/* Analytics Section */}
          <div id="analytics" className="mb-12 scroll-mt-24">
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-900 dark:bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Enrollment Intelligence</h3>
                  <p className="text-sm text-gray-400 font-medium">Monthly student acquisition trends.</p>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs font-black text-gray-400 hover:text-indigo-600 transition-all">Export Report</button>
                </div>
              </div>
              {courses.length > 0 ? (
                <AnalyticsChart data={courses} />
              ) : (
                <div className="flex h-[300px] flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                  <BarChart3 size={48} className="mb-4 opacity-20" />
                  <p className="font-bold">Awaiting curriculum deployment...</p>
                </div>
              )}
            </div>
          </div>

          {/* Courses Table */}
          <div id="courses" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Course Portfolio</h3>
               <div className="flex items-center gap-4">
                  <div className="relative hidden sm:block">
                     <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input type="text" placeholder="Search courses..." className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-indigo-600/20" />
                  </div>
                  <button className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 transition-all">
                     <Filter size={18} />
                  </button>
               </div>
            </div>

            <div className="rounded-[2.5rem] border border-gray-100 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Curriculum</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Metrics</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">State</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    <AnimatePresence>
                      {courses.map((course) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={course.id} 
                          className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative border border-gray-100 dark:border-gray-700">
                                 {course.thumbnail ? (
                                    <img src={course.thumbnail} className="h-full w-full object-cover" />
                                 ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-300"><BookOpen size={20} /></div>
                                 )}
                              </div>
                              <div>
                                <p className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{course.title}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{course.category || 'Development'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                               <Users size={14} className="text-gray-400" />
                               <span className="text-sm font-black text-gray-700 dark:text-gray-300">{course.students || 0}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-indigo-600">
                            ${course.price || "0"}
                          </td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block",
                              course.status === "Published" 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" 
                                : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                            )}>
                              {course.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => { setEditingCourse(course); setIsModalOpen(true); }}
                                className="p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {courses.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center">
                            <div className="h-20 w-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                               <BookOpen size={32} className="text-gray-300" />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white">Curriculum Empty</h4>
                            <p className="text-gray-500 font-medium max-w-xs mt-2">Deploy your first course to begin scaling your student impact.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CourseModal 
        user={user}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCourse}
        initialData={editingCourse}
      />
    </div>
  );
}
