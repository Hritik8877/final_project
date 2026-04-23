"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { GraduationCap, ArrowRight, Play, Globe, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  const { user, loading } = useSelector((state) => state.auth);
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
            <GraduationCap size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">EduCore</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 cursor-pointer">Courses</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 cursor-pointer">Instructors</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400 cursor-pointer">Pricing</a>
        </div>
        <div className="flex items-center gap-4 h-10">
          {!loading && (
            user ? (
              <Link href="/dashboard" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all dark:shadow-none cursor-pointer">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600 cursor-pointer">
                  Sign in
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all dark:shadow-none cursor-pointer">
                  Get Started
                </Link>
              </>
            )
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-8 dark:bg-indigo-900/20 dark:border-indigo-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Transform your future</span>
                <span className="h-1 w-1 rounded-full bg-indigo-400"></span>
                <span className="text-xs font-medium text-indigo-600/80 dark:text-indigo-400/80">Join 50k+ students</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                Unlock Your Potential with <span className="text-indigo-600">EduCore</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                Experience world-class learning from industry experts. Master new skills, advance your career, and achieve your goals with our premium course catalog.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href={user ? "/dashboard" : "/register"} 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all group dark:shadow-none cursor-pointer"
                >
                  {user ? "Back to Dashboard" : "Start Your Journey"}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                {!user && (
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-pointer">
                    <Play size={20} fill="currentColor" />
                    Watch Demo
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-50/50 rounded-[100%] blur-3xl -z-10 dark:bg-indigo-900/5"></div>
        </section>

        {/* Feature Highlights */}
        <section className="py-24 bg-gray-50 dark:bg-[#0D0D0D]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-3xl shadow-sm dark:bg-[#111] dark:border dark:border-gray-800 cursor-pointer hover:border-indigo-200 transition-all">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 dark:bg-blue-900/20 dark:text-blue-400">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">Learn Anywhere</h3>
                <p className="text-gray-600 dark:text-gray-400">Access your courses across all devices, with offline modes and mobile apps for learning on the go.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm dark:bg-[#111] dark:border dark:border-gray-800 cursor-pointer hover:border-indigo-200 transition-all">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">Verified Certificates</h3>
                <p className="text-gray-600 dark:text-gray-400">Earn industry-recognized certificates upon completion to showcase your expertise and boost your resume.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm dark:bg-[#111] dark:border dark:border-gray-800 cursor-pointer hover:border-indigo-200 transition-all">
                <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 dark:bg-orange-900/20 dark:text-orange-400">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">Expert Global Network</h3>
                <p className="text-gray-600 dark:text-gray-400">Connect with thousands of learners and instructors in our vibrant community forums and live sessions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-8 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
             <div className="h-6 w-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <GraduationCap size={14} />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">EduCore</span>
          </Link>
          <p className="text-gray-500 text-sm">© 2026 EduCore LMS. Built for visionaries.</p>
        </div>
      </footer>
    </div>
  );
}
