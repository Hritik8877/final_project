/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { 
  GraduationCap, 
  ArrowRight, 
  Play, 
  Globe, 
  ShieldCheck, 
  Users, 
  Star, 
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Menu,
  X
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const { user, loading } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"), limit(3));
        const snapshot = await getDocs(q);
        const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0A0A0A] selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-900 dark:bg-[#0A0A0A]/80">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition-transform group-hover:scale-105">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">EduCore</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <a href="#courses" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">Courses</a>
            <a href="#instructors" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">Instructors</a>
            <a href="#pricing" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
            {!loading && (
              user ? (
                <Link href={`/dashboard/${user.role || 'student'}`} className="hidden sm:block bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Dashboard
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors px-4">
                    Sign in
                  </Link>
                  <Link href="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Join Free
                  </Link>
                </div>
              )
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-900 shadow-xl py-4 px-6 flex flex-col gap-4">
            <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-700 dark:text-gray-300">Courses</a>
            <a href="#instructors" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-700 dark:text-gray-300">Instructors</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-700 dark:text-gray-300">Pricing</a>
            <hr className="border-gray-100 dark:border-gray-800 my-2" />
            {!loading && (
              user ? (
                <Link href={`/dashboard/${user.role || 'student'}`} className="bg-indigo-600 text-center text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg shadow-indigo-600/20">
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="text-center py-3 text-lg font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl">
                    Sign in
                  </Link>
                  <Link href="/register" className="bg-indigo-600 text-center text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg shadow-indigo-600/20">
                    Join Free
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* Hero Section - Linear Inspired */}
        <section className="relative pt-20 pb-32 overflow-hidden border-b border-gray-100 dark:border-gray-900">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-3 bg-indigo-50/50 border border-indigo-100 px-4 py-2 rounded-full mb-10 dark:bg-indigo-900/10 dark:border-indigo-800/50">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Revolutionizing Learning</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
                Master Skills that <br />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Define Futures.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                EduCore is the world&apos;s most advanced LMS. Learn from elite instructors, track real-time progress, and earn global credentials.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href={user ? `/dashboard/${user.role || 'student'}` : "/register"} 
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all group"
                >
                  Get Started for Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  <Play size={20} fill="currentColor" />
                  View Demo
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Subtle Background Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-violet-500/10 rounded-full blur-[120px]"></div>
          </div>
        </section>

        {/* Dynamic Social Proof */}
        <section className="py-12 bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-900">
           <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-700">
                 <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic">TECH CORP</div>
                 <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic">EDU VENTURES</div>
                 <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic">FUTURE LABS</div>
                 <div className="flex items-center gap-2 font-black text-2xl tracking-tighter italic">GLOBAL ACADEMY</div>
              </div>
           </div>
        </section>

        {/* Feature Grid */}
        <section className="py-32 bg-white dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {[
                { 
                  icon: <Zap className="text-indigo-600" />, 
                  title: "Lightning Fast Learning", 
                  desc: "Stream lessons in 4K with adaptive bitrate. No buffering, just learning." 
                },
                { 
                  icon: <Award className="text-emerald-600" />, 
                  title: "Elite Certification", 
                  desc: "Earn blockchain-verified certificates that stand out to global recruiters." 
                },
                { 
                  icon: <TrendingUp className="text-orange-600" />, 
                  title: "Career Tracking", 
                  desc: "Built-in analytics help you track skill acquisition and market readiness." 
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="group p-10 rounded-[2rem] bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:border-indigo-600/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-500"
                >
                  <div className="h-14 w-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Courses - Redesigned Card */}
        <section id="courses" className="py-32 bg-gray-50/50 dark:bg-[#0D0D0D] scroll-mt-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black dark:text-white mb-4 tracking-tight">Level Up Your Skills</h2>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Hand-picked premium courses designed by industry titans.</p>
              </div>
              <Link href="/register" className="flex items-center gap-2 text-indigo-600 font-black text-lg hover:gap-4 transition-all">
                Browse Full Catalog <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {loadingCourses ? (
                [1, 2, 3].map((skeleton) => (
                  <div key={skeleton} className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] animate-pulse"></div>
                ))
              ) : courses.length > 0 ? courses.map((course, i) => {
                const colors = [
                  "from-blue-500 to-indigo-600",
                  "from-violet-500 to-purple-600",
                  "from-orange-500 to-red-600",
                  "from-emerald-500 to-teal-600"
                ];
                const color = colors[i % colors.length];
                
                return (
                  <div key={course.id || i} className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-indigo-600/50 hover:shadow-2xl transition-all duration-500">
                    <div className={`h-64 bg-gradient-to-br ${color} relative overflow-hidden`}>
                       {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:opacity-100 transition-opacity" />}
                       <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-black shadow-lg">
                          ${course.price || "Free"}
                       </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                         <div className="flex text-amber-400"><Star size={16} fill="currentColor" /></div>
                         <span className="text-sm font-black dark:text-white">{course.rating || "5.0"}</span>
                         <span className="text-gray-400">•</span>
                         <span className="text-sm text-gray-400">{course.students || 0} students</span>
                      </div>
                      <h3 className="text-2xl font-black mb-3 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">{course.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-8 line-clamp-2">{course.description || `with ${course.instructorName}`}</p>
                      
                      <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                         <Link href={`/course/${course.id}`} className="w-full py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center">
                            View Course
                         </Link>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-1 md:col-span-3 text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                   <p className="text-xl font-bold text-gray-500 dark:text-gray-400">No courses available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-8 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
           <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-8">
                 <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                    <GraduationCap size={18} />
                 </div>
                 <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">EduCore</span>
              </Link>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                 Empowering the next generation of digital creators and engineers through elite education.
              </p>
           </div>
           
           <div>
              <h4 className="font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest text-xs">Resources</h4>
              <ul className="space-y-4">
                 <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Course Library</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Success Stories</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Scholarships</a></li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4">
                 <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">About Us</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact</a></li>
                 <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Careers</a></li>
              </ul>
           </div>

           <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <h4 className="font-black mb-4 relative z-10 text-xl">Newsletter</h4>
              <p className="text-white/70 mb-6 text-sm relative z-10">Get the latest updates on new courses.</p>
              <input type="email" placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none mb-4 relative z-10" />
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-sm relative z-10 hover:bg-gray-100 transition-all">Subscribe</button>
              
              <div className="absolute top-0 right-0 h-24 w-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-gray-100 dark:border-gray-900 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-gray-400 text-sm font-medium">© 2026 EduCore LMS. All rights reserved.</p>
           <div className="flex items-center gap-8 text-sm font-bold text-gray-400">
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Cookies</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
