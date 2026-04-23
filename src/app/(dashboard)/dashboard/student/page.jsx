"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  limit,
  doc
} from "firebase/firestore";
import { 
  BookOpen, 
  PlayCircle, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Search,
  Bell,
  Menu,
  ChevronRight,
  Flame,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import CourseCard from "@/components/CourseCard";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { sanitizeFirestoreData } from "@/lib/firebaseUtils";
import { toast } from "react-hot-toast";
import { setCourses, setWishlist, setCourseLoading } from "@/redux/slices/courseSlice";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { courses: recommendedCourses, wishlist, loading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    // Fetch Wishlist
    const wishlistUnsubscribe = onSnapshot(doc(db, "wishlists", user.uid), (doc) => {
      if (doc.exists()) {
        const data = sanitizeFirestoreData(doc.data());
        dispatch(setWishlist(data.courseIds || []));
      }
    });

    // Fetch Recommended Courses
    dispatch(setCourseLoading(true));
    const coursesQuery = query(collection(db, "courses"), limit(3));
    const coursesUnsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => sanitizeFirestoreData({ id: doc.id, ...doc.data() }));
      dispatch(setCourses(data));
      dispatch(setCourseLoading(false));
    });

    return () => {
      wishlistUnsubscribe();
      coursesUnsubscribe();
    };
  }, [user, dispatch]);

  const stats = [
    { label: "Courses Enrolled", value: "4", icon: <BookOpen />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Lessons Completed", value: "27", icon: <PlayCircle />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Learning Points", value: "1,240", icon: <Trophy />, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Study Hours", value: "12.5h", icon: <Clock />, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0A0A0A]">
      <DashboardSidebar role="student" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 lg:ml-72 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-10 dark:border-gray-900 dark:bg-[#0A0A0A]/80">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-xl">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          </div>

          {/* Search Bar (Middle) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
             <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Find courses, learning paths..." 
               className="w-full pl-12 pr-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
             />
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="relative p-3 text-gray-400 hover:text-indigo-600 transition-colors">
               <Bell size={22} />
               <span className="absolute top-3.5 right-3.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#0A0A0A]"></span>
            </button>
            <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-900 hidden sm:block"></div>
            <div className="flex items-center gap-4">
               <div className="hidden text-right md:block">
                  <p className="text-sm font-black dark:text-white leading-tight">{user?.displayName}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center justify-end gap-1">
                     <Flame size={10} fill="currentColor" /> Student
                  </p>
               </div>
               <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/20">
                  {user?.displayName?.[0]}
               </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Welcome back, {user?.displayName?.split(' ')[0]}! 👋</h2>
            <p className="text-gray-500 font-medium text-lg">Ready to master a new skill today?</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800 hover:border-indigo-600/30 transition-all"
              >
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h4>
              </motion.div>
            ))}
          </div>

          {/* Continue Learning */}
          <div className="mb-16">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Continue Learning</h3>
                <button className="text-sm font-black text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">View All <ChevronRight size={16} /></button>
             </div>
             
             <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex-1">
                      <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">Current Course</span>
                      <h4 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Advanced React Patterns & Performance</h4>
                      <div className="flex items-center gap-6">
                         <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden max-w-xs">
                            <div className="h-full bg-white w-[65%]"></div>
                         </div>
                         <span className="text-sm font-black">65% Complete</span>
                      </div>
                   </div>
                   <button className="h-20 w-20 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all group/play">
                      <PlayCircle size={40} fill="currentColor" />
                   </button>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-transform group-hover:scale-110 duration-700"></div>
             </div>
          </div>

          {/* Recommended Courses */}
          <div>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Recommended for You</h3>
                <Link href="/courses" className="text-sm font-black text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">Explore Catalog <ChevronRight size={16} /></Link>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {recommendedCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  isWishlisted={wishlist.includes(course.id)}
                  onWishlistToggle={(id) => {
                    // Wishlist logic will be implemented in Step 7
                    toast.success("Coming soon!");
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
