"use client";
import Link from "next/link";
import { Star, Users, ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CourseCard({ course, isWishlisted, onWishlistToggle }) {
  return (
    <div className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-indigo-600/50 hover:shadow-2xl transition-all duration-500">
      <div className="h-52 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 font-black text-2xl uppercase italic">
            {course.title.slice(0, 2)}
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle?.(course.id);
          }}
          className={cn(
            "absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md transition-all active:scale-90",
            isWishlisted 
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
              : "bg-white/80 dark:bg-black/50 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-black"
          )}
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        
        <div className="absolute bottom-4 left-4 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
          {course.category || "Development"}
        </div>
      </div>

      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
           <div className="flex text-amber-400"><Star size={16} fill="currentColor" /></div>
           <span className="text-xs font-black dark:text-white">{course.rating || "5.0"}</span>
           <span className="text-gray-300 dark:text-gray-700">•</span>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{course.students || 0} Learners</span>
        </div>

        <h3 className="text-xl font-black mb-3 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-400 font-bold text-xs mb-8 uppercase tracking-widest">
          By {course.instructorName || "Elite Instructor"}
        </p>
        
        <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
              <span className="text-xl font-black text-gray-900 dark:text-white">${course.price || "0"}</span>
           </div>
           <Link 
             href={`/course/${course.id}`}
             className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-indigo-600 hover:text-white hover:scale-110 transition-all flex items-center justify-center group/btn"
           >
              <ArrowRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
           </Link>
        </div>
      </div>
    </div>
  );
}
