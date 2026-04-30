"use client";
import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CourseCard from "@/components/CourseCard";
import { Loader2, Search, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CoursesCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"));
        const snapshot = await getDocs(q);
        const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/dashboard/student" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 mb-4 transition-colors">
              <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Course Catalog</h1>
            <p className="text-gray-500 mt-2 font-medium">Discover new skills and master your craft.</p>
          </div>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium text-gray-900 dark:text-white"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
             <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : (
          <>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isWishlisted={false}
                    onWishlistToggle={() => toast.success("Added to wishlist")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No courses found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search query.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
