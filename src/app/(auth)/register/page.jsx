"use client";
import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, BookOpen, UserCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Save user to Firestore with role
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        role: role,
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created successfully!");
      router.replace(`/dashboard/${role}`);
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0A0A0A]">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 p-20 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">EduCore</span>
          </Link>
          
          <div className="mt-32">
             <h2 className="text-6xl font-black text-white leading-tight mb-8">
                Empower your <br /> career with <br /> new skills.
             </h2>
             <p className="text-white/70 text-xl font-medium max-w-md">
                Whether you want to learn or teach, EduCore provides the tools you need to succeed in the digital economy.
             </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-white/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md py-12"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Join our community and start your journey.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                 <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={cn(
                       "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                       role === "student" 
                         ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600" 
                         : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500"
                    )}
                 >
                    <BookOpen size={24} />
                    <span className="font-bold text-sm">Learn</span>
                 </button>
                 <button
                    type="button"
                    onClick={() => setRole("instructor")}
                    className={cn(
                       "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                       role === "instructor" 
                         ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600" 
                         : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500"
                    )}
                 >
                    <UserCircle size={24} />
                    <span className="font-bold text-sm">Teach</span>
                 </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-black hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
