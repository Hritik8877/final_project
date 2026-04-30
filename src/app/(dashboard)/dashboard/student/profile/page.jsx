"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Menu, User, Mail, Shield, Camera, Save } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function StudentProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      <DashboardSidebar role="student" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 lg:ml-72 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-24 items-center gap-4 border-b border-gray-100 bg-white/80 backdrop-blur-md px-10 dark:border-gray-900 dark:bg-[#0A0A0A]/80">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-xl">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Profile Settings</h1>
        </header>

        <div className="p-6 lg:p-10 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
             <div className="flex flex-col sm:flex-row items-center gap-8 mb-12 pb-12 border-b border-gray-100 dark:border-gray-800">
                <div className="relative group">
                   <div className="w-32 h-32 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-xl">
                      {user?.displayName?.[0] || "U"}
                   </div>
                   <button className="absolute bottom-[-10px] right-[-10px] p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:text-indigo-600 transition-colors">
                      <Camera size={18} />
                   </button>
                </div>
                <div className="text-center sm:text-left">
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{user?.displayName || "Student User"}</h2>
                   <p className="text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-2">
                      <Mail size={16} /> {user?.email}
                   </p>
                </div>
             </div>

             <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                   <div className="relative">
                      <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-5 py-4 font-bold focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all dark:text-white"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Read Only)</label>
                   <div className="relative">
                      <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        value={user?.email || ""}
                        disabled
                        className="w-full bg-gray-100 dark:bg-gray-800/50 border border-transparent rounded-2xl pl-12 pr-5 py-4 font-bold text-gray-400 cursor-not-allowed"
                      />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
                   <div className="relative">
                      <Shield size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={user?.role || "student"}
                        disabled
                        className="w-full bg-gray-100 dark:bg-gray-800/50 border border-transparent rounded-2xl pl-12 pr-5 py-4 font-bold text-gray-400 cursor-not-allowed capitalize"
                      />
                   </div>
                </div>

                <div className="pt-8">
                   <button 
                     type="submit" 
                     disabled={saving}
                     className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-70"
                   >
                      <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
                   </button>
                </div>
             </form>
          </div>
        </div>
      </main>
    </div>
  );
}
