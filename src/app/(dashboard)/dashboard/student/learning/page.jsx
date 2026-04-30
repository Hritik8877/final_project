/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Menu, PlayCircle, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function MyLearningPage() {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      if (!user?.uid) return;
      try {
        const q = query(collection(db, "enrollments"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const userEnrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch course details for each enrollment
        const coursesWithDetails = await Promise.all(
          userEnrollments.map(async (enr) => {
             const courseRef = query(collection(db, "courses"), where("__name__", "==", enr.courseId));
             const courseSnap = await getDocs(courseRef);
             if (!courseSnap.empty) {
                return { ...enr, course: courseSnap.docs[0].data() };
             }
             return enr;
          })
        );
        
        setEnrollments(coursesWithDetails);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your learning data");
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      <DashboardSidebar role="student" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 lg:ml-72 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-24 items-center gap-4 border-b border-gray-100 bg-white/80 backdrop-blur-md px-10 dark:border-gray-900 dark:bg-[#0A0A0A]/80">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-xl">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">My Learning</h1>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
           {loading ? (
             <div className="animate-pulse space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-3xl w-full"></div>
                ))}
             </div>
           ) : enrollments.length > 0 ? (
             <div className="grid grid-cols-1 gap-6">
                {enrollments.map((enr) => (
                  <div key={enr.id} className="flex flex-col md:flex-row gap-6 p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                     <div className="w-full md:w-64 h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 relative">
                        {enr.course?.thumbnail ? (
                           <img src={enr.course.thumbnail} className="w-full h-full object-cover" alt="thumbnail" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400"><BookOpen size={40} /></div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full">
                           {enr.progress || 0}% Done
                        </div>
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{enr.course?.title || "Unknown Course"}</h3>
                        <p className="text-gray-500 text-sm mb-6 flex items-center gap-4">
                           <span className="flex items-center gap-1"><Clock size={16} /> Enrolled on {new Date(enr.enrolledAt).toLocaleDateString()}</span>
                        </p>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
                           <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${enr.progress || 0}%` }}></div>
                        </div>
                        <div className="flex justify-end">
                           <Link href={`/course/${enr.courseId}/learn`} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
                              <PlayCircle size={20} /> Continue Learning
                           </Link>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                   <BookOpen size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You aren&apos;t enrolled in any courses yet</h3>
                <p className="text-gray-500 mb-8 font-medium">Browse our catalog to find the perfect course for you.</p>
                <Link href="/courses" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                   Explore Catalog
                </Link>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
