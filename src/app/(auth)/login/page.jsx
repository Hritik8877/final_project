"use client";
import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Globe,
  BookOpen,
  UserCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Role selection during login
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update role in Firestore to the selected one
      await updateDoc(doc(db, "users", user.uid), {
        role: role
      });

      toast.success(`Welcome back, ${role}!`);
      router.replace(`/dashboard/${role}`);
    } catch (err) {
      toast.error(err.message || "Failed to login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new profile with selected role
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          role: role,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Update existing profile with selected role
        await updateDoc(userRef, {
          role: role
        });
      }

      toast.success(`Logged in as ${role}`);
      router.replace(`/dashboard/${role}`);
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0A0A0A]">
      {/* Left Side: Illustration & Text */}
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
                Your journey to <br /> mastery starts <br /> right here.
             </h2>
             <p className="text-white/70 text-xl font-medium max-w-md">
                Sign in to your dashboard and continue your path to excellence.
             </p>
          </div>
        </div>

        <div className="relative z-10">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] max-w-sm">
              <p className="text-white font-medium mb-4 italic">
                 "The flexibility to switch between teaching and learning is what makes EduCore unique."
              </p>
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-indigo-400 rounded-full"></div>
                 <div>
                    <p className="text-white font-bold text-sm">Sarah Jenkins</p>
                    <p className="text-white/60 text-xs">Lead Instructor @ EduCore</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-white/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-black/10 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md py-12"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Please select your role and sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Sign in as</label>
              <div className="grid grid-cols-2 gap-4">
                 <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={cn(
                       "flex flex-col items-center gap-3 p-5 rounded-[2rem] border-2 transition-all text-left",
                       role === "student" 
                         ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600" 
                         : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400"
                    )}
                 >
                    <BookOpen size={24} />
                    <span className="font-black text-xs uppercase tracking-widest">Student</span>
                 </button>
                 <button
                    type="button"
                    onClick={() => setRole("instructor")}
                    className={cn(
                       "flex flex-col items-center gap-3 p-5 rounded-[2rem] border-2 transition-all text-left",
                       role === "instructor" 
                         ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600" 
                         : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400"
                    )}
                 >
                    <UserCircle size={24} />
                    <span className="font-black text-xs uppercase tracking-widest">Instructor</span>
                 </button>
              </div>
            </div>

            <div className="space-y-6">
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
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">Password</label>
                  <Link href="#" className="text-sm font-bold text-indigo-600 hover:underline">Forgot password?</Link>
                </div>
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In Now <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
             <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-800"></div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Or use social</span>
             <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-800"></div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
             <button 
               onClick={handleGoogleLogin}
               className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
             >
                <Globe size={20} />
                Google Account
             </button>
          </div>

          <p className="mt-12 text-center text-gray-500 font-medium">
            New to EduCore?{" "}
            <Link href="/register" className="text-indigo-600 font-black hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
