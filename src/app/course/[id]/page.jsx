"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Heart, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Award,
  BookOpen,
  X,
  Loader2,
  Play
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactPlayer from "react-player";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      // Fetch Course
      const docSnap = await getDoc(doc(db, "courses", id));
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() });
      }

      // Check Enrollment
      const user = auth.currentUser;
      if (user) {
        const enrollmentRef = doc(db, "enrollments", `${user.uid}_${id}`);
        const enrollmentSnap = await getDoc(enrollmentRef);
        if (enrollmentSnap.exists()) {
          setIsEnrolled(true);
        }
      }
      setLoading(false);
    };

    // Use auth state listener to ensure user is loaded
    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchCourseAndEnrollment();
    });

    return () => unsubscribe();
  }, [id]);

  const handleMockPayment = async () => {
    setIsPurchasing(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to purchase");
        router.push("/login");
        return;
      }

      await new Promise(r => setTimeout(r, 1500));

      const enrollmentRef = doc(db, "enrollments", `${user.uid}_${id}`);
      await setDoc(enrollmentRef, {
        userId: user.uid,
        courseId: id,
        enrolledAt: new Date().toISOString(),
        progress: 0,
      });

      const courseRef = doc(db, "courses", id);
      await updateDoc(courseRef, {
        students: (course.students || 0) + 1
      });

      setIsEnrolled(true);
      toast.success("Successfully enrolled!");
      setShowPaymentModal(false);
      router.push(`/course/${id}/learn`);
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0A0A0A]">
       <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  if (!course) return <div className="flex h-screen items-center justify-center font-black uppercase text-gray-400 tracking-widest">Course not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      {/* Hero Section */}
      <div className="bg-[#050505] pt-20 pb-40 px-6 lg:px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                 <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em]">Bestseller</span>
                 <div className="flex text-amber-400 gap-1"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                 <span className="text-sm font-bold text-gray-500">(4.9 out of 5.0)</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-gray-400 font-medium mb-10 max-w-xl leading-relaxed">
                {course.description || "Master the art of this discipline with industry-recognized patterns and real-world case studies."}
              </p>
              <div className="flex flex-wrap items-center gap-8 text-white/70">
                 <div className="flex items-center gap-2 font-bold"><Users size={20} className="text-indigo-500" /> {course.students || 0} Learners</div>
                 <div className="flex items-center gap-2 font-bold"><Clock size={20} className="text-indigo-500" /> 12h Total Length</div>
                 <div className="flex items-center gap-2 font-bold"><Award size={20} className="text-indigo-500" /> Professional Certification</div>
              </div>
           </motion.div>
        </div>
        
        
        {/* Course Card - Stacked on Mobile, Floating on Desktop */}
        <div className="lg:absolute top-20 right-10 lg:right-32 w-full lg:w-[24rem] z-20 mt-10 lg:mt-0">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="h-60 bg-gray-100 relative group cursor-pointer" onClick={() => { setShowTrailer(true); setIsPlayerReady(false); }}>
                 <img src={course.thumbnail} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-2xl group-hover:scale-110 transition-transform">
                       <Play size={32} fill="currentColor" />
                    </div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Preview Trailer</span>
                 </div>
              </div>
              <div className="p-10">
                 {isEnrolled ? (
                    <div className="space-y-4">
                       <div className="text-emerald-500 font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                          <CheckCircle size={18} /> You are enrolled
                       </div>
                       <button 
                         onClick={() => router.push(`/course/${course.id}/learn`)}
                         className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                       >
                          Continue Learning
                       </button>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       <div className="text-4xl font-black text-gray-900 dark:text-white">${course.price} <span className="text-sm text-gray-400 font-bold line-through ml-2">$199.99</span></div>
                       <button 
                         onClick={() => setShowPaymentModal(true)}
                         className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                       >
                          Enroll Now
                       </button>
                       <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">30-Day Money Back Guarantee</p>
                    </div>
                 )}
                 
                 <div className="mt-8 space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <p className="font-black text-[10px] text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-4">This course includes:</p>
                    <div className="space-y-4">
                       {[
                         { icon: <PlayCircle size={18} />, text: "12 hours on-demand video" },
                         { icon: <BookOpen size={18} />, text: "15 downloadable resources" },
                         { icon: <ShieldCheck size={18} />, text: "Full lifetime access" },
                         { icon: <Award size={18} />, text: "Certificate of completion" },
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            <span className="text-indigo-500">{item.icon}</span>
                            {item.text}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-[120px] -z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
         <div className="lg:w-2/3">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">Mastery Curriculum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-24">
               {[
                 "Build robust, production-grade applications",
                 "Master advanced architectural patterns",
                 "Optimize performance with modern tools",
                 "Automate workflows and deployment",
                 "Collaborate in elite engineering teams",
                 "Design beautiful, accessible interfaces"
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                       <CheckCircle className="text-indigo-600" size={18} />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{item}</span>
                 </div>
               ))}
            </div>

            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Curriculum Preview</h3>
            <div className="space-y-4">
               {(course.lessons || []).map((lesson, i) => (
                 <div key={i} className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 border border-transparent hover:border-indigo-600/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                       <div className="h-12 w-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black shadow-sm">
                          {i + 1}
                       </div>
                       <div>
                          <p className="font-black text-gray-900 dark:text-white">{lesson.title}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{lesson.duration || "Video Lesson"}</p>
                       </div>
                    </div>
                    {isEnrolled ? <PlayCircle size={24} className="text-indigo-600" /> : <ShieldCheck size={24} className="text-gray-300" />}
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Trailer Overlay */}
      <AnimatePresence>
        {showTrailer && (
           <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTrailer(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.2)]"
              >
                 <button 
                   onClick={() => setShowTrailer(false)}
                   className="absolute top-6 right-6 z-10 h-12 w-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                 >
                    <X size={24} />
                 </button>
                 {(() => {
                   const videoUrl = course.introVideo && course.introVideo !== "" 
                     ? course.introVideo 
                     : (course.lessons && course.lessons.length > 0 ? course.lessons[0].videoUrl : null);
                   
                   return videoUrl ? (
                     <video
                       key={videoUrl}
                       src={videoUrl}
                       className="h-full w-full"
                       controls
                       autoPlay
                       muted
                       playsInline
                       onEnded={() => setShowTrailer(false)}
                       onError={(e) => {
                         console.error("Trailer Video Error:", e);
                         toast.error("Trailer failed to load.");
                       }}
                     >
                        Your browser does not support the video tag.
                     </video>
                   ) : (
                     <div className="flex h-full w-full items-center justify-center text-gray-500 font-black uppercase tracking-widest bg-gray-900">
                        No Preview Available for this course
                     </div>
                   );
                 })()}
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Payment Modal (Razorpay Mock) */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl overflow-hidden border border-white/20"
             >
                <div className="text-center mb-10">
                   <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-600/30">
                      <ShieldCheck size={32} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Checkout Securely</h2>
                   <p className="text-gray-500 font-medium mt-2">Powered by Razorpay Secure Pay</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 mb-10 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Course</span>
                      <span className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">{course.title}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Subtotal</span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">${course.price}</span>
                   </div>
                   <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
                   <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-black text-indigo-600">${course.price}</span>
                   </div>
                </div>

                <button 
                  onClick={handleMockPayment}
                  disabled={isPurchasing}
                  className="w-full h-16 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                   {isPurchasing ? <Loader2 className="animate-spin" /> : <>Pay Securely with Razorpay <ArrowRight size={20} /></>}
                </button>
                
                <button onClick={() => setShowPaymentModal(false)} className="w-full mt-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancel Payment</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
