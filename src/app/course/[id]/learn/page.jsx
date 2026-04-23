"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { 
  PlayCircle, 
  CheckCircle, 
  ChevronLeft, 
  Menu, 
  X, 
  Lock,
  MessageSquare,
  FileText,
  Settings,
  Share2,
  Award,
  Loader2,
  MoreHorizontal
} from "lucide-react";
import ReactPlayer from "react-player";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CoursePlayerPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkEnrollmentAndFetch = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      const enrollmentRef = doc(db, "enrollments", `${user.uid}_${id}`);
      const enrollmentSnap = await getDoc(enrollmentRef);
      
      if (!enrollmentSnap.exists()) {
        toast.error("Please enroll to view content");
        router.push(`/course/${id}`);
        return;
      }
      setIsEnrolled(true);

      const courseSnap = await getDoc(doc(db, "courses", id));
      if (courseSnap.exists()) {
        const courseData = { id: courseSnap.id, ...courseSnap.data() };
        setCourse(courseData);
        
        const realLessons = courseData.lessons || [];
        setLessons(realLessons);
        if (realLessons.length > 0) {
          setActiveLesson(realLessons[0]);
        }
      }
      setLoading(false);
    };

    checkEnrollmentAndFetch();
  }, [id, router]);

  useEffect(() => {
    if (videoRef.current && activeLesson?.videoUrl) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Playback was interrupted or prevented by the browser. 
          // We catch this to prevent the "Unhandled Runtime Error" popup.
          console.log("Playback safely handled:", error.message);
        });
      }
    }
  }, [activeLesson]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0A0A0A]">
       <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-[#0A0A0A] overflow-hidden">
      {/* Main Content Area (Left) */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#050505] relative overflow-y-auto">
        {/* Navigation Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 dark:border-gray-900 dark:bg-[#0A0A0A]/80">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight truncate max-w-md">{course?.title}</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                {auth.currentUser?.displayName?.[0]}
             </button>
          </div>
        </header>

        {/* Video Player */}
        <div className="flex-1 bg-[#0A0A0B] flex items-center justify-center p-4 md:p-8">
           <div className="relative aspect-video w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
              {activeLesson?.videoUrl ? (
                <>
                  <div className="relative h-full w-full bg-black">
                    <video
                      ref={videoRef}
                      src={activeLesson.videoUrl}
                      className="h-full w-full"
                      controls
                      muted
                      playsInline
                      onEnded={() => toast.success("Lesson completed!")}
                      onError={(e) => {
                        console.error("Native Video Error:", e);
                        toast.error("Video format not supported or URL invalid.");
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="mt-2 flex justify-center">
                    <a 
                      href={activeLesson.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-gray-500 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                    >
                      Trouble playing? Open video in new tab ↗
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-500 font-bold uppercase tracking-widest bg-gray-900/50">
                   Select a lesson to begin
                </div>
              )}
           </div>
        </div>

        {/* Lesson Info */}
        <div className="p-8 md:p-12">
           <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{activeLesson?.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                Master the fundamentals of React components and how to pass data using props. This lesson covers functional components, class components, and best practices for structuring your UI.
              </p>
              
              <div className="flex flex-wrap gap-4 border-t border-gray-100 dark:border-gray-900 pt-8">
                 <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all">
                    <MessageSquare size={18} /> Discussion
                 </button>
                 <button className="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-sm flex items-center gap-2 border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    <FileText size={18} /> Resources
                 </button>
              </div>
           </div>
        </div>
      </main>

      {/* Lesson Sidebar (Right) */}
      <aside className={cn(
        "hidden lg:flex flex-col w-96 border-l border-gray-100 bg-white dark:border-gray-900 dark:bg-[#0A0A0A] h-full",
      )}>
        <div className="p-8 border-b border-gray-100 dark:border-gray-900">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Course Progress</h3>
              <span className="text-sm font-black text-indigo-600">17%</span>
           </div>
           <div className="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-indigo-600 w-[17%] transition-all duration-1000"></div>
           </div>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">2 of 12 lessons completed</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2">Lessons</p>
              <div className="space-y-3">
                 {lessons.map((lesson) => (
                   <button
                     key={lesson.id}
                     onClick={() => setActiveLesson(lesson)}
                     className={cn(
                       "w-full text-left p-5 rounded-3xl transition-all border-2",
                       activeLesson?.id === lesson.id 
                         ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-600/10" 
                         : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-900"
                     )}
                   >
                     <div className="flex items-center gap-4">
                        <div className={cn(
                           "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
                           lesson.completed ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"
                        )}>
                           {lesson.completed && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className={cn(
                              "text-sm font-bold truncate mb-1",
                              activeLesson?.id === lesson.id ? "text-indigo-600" : "text-gray-900 dark:text-white"
                           )}>
                              {lesson.title}
                           </p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lesson.duration}</p>
                        </div>
                     </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
}
