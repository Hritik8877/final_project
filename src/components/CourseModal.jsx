"use client";
import { useState, useEffect } from "react";
import { 
  X, 
  Upload, 
  DollarSign, 
  Loader2, 
  Video, 
  Image as ImageIcon, 
  CheckCircle,
  Plus,
  Trash2,
  GripVertical,
  Play
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function CourseModal({ isOpen, onClose, onSave, initialData, user }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Development",
    thumbnail: "",
    introVideo: "",
    lessons: [],
    status: "Draft",
  });

  const [newLesson, setNewLesson] = useState({ title: "", videoUrl: "", duration: "" });
  const [showAddLesson, setShowAddLesson] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        lessons: initialData.lessons || []
      });
    } else {
      // Try to load draft from localStorage if creating a new course
      const savedDraft = localStorage.getItem("course_draft");
      if (savedDraft) {
        try {
          setFormData(JSON.parse(savedDraft));
        } catch (e) {
          console.error("Failed to parse course draft", e);
        }
      } else {
        setFormData({ 
          title: "", 
          description: "", 
          price: "", 
          category: "Development", 
          thumbnail: "", 
          introVideo: "",
          lessons: [],
          status: "Draft" 
        });
      }
    }
  }, [initialData, isOpen]);

  // Save to localStorage whenever formData changes (only for new courses)
  useEffect(() => {
    if (!initialData && isOpen) {
      localStorage.setItem("course_draft", JSON.stringify(formData));
    }
  }, [formData, initialData, isOpen]);

  const handleClose = () => {
    if (!initialData && formData.title) {
       if (confirm("Discard your course draft?")) {
          localStorage.removeItem("course_draft");
          onClose();
       }
    } else {
       onClose();
    }
  };

  if (!isOpen) return null;

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.videoUrl) {
      toast.error("Please provide a title and upload a video");
      return;
    }
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, { ...newLesson, id: Date.now().toString() }]
    }));
    setNewLesson({ title: "", videoUrl: "", duration: "" });
    setShowAddLesson(false);
    toast.success("Lesson added to curriculum!");
  };

  const removeLesson = (id) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.filter(l => l.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.thumbnail) {
      toast.error("Please upload a thumbnail");
      return;
    }
    if (formData.lessons.length === 0) {
      toast.error("Please add at least one lesson to your curriculum");
      return;
    }
    
    // Clear draft on successful submission
    if (!initialData) {
      localStorage.removeItem("course_draft");
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {initialData ? "Refine Course" : "Forge New Course"}
            </h2>
            <p className="text-gray-500 text-sm font-medium italic">Build your curriculum with Cloudinary multi-media.</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Basic Info */}
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-gray-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 dark:border-gray-800 dark:bg-gray-800 dark:text-white transition-all font-bold"
                  placeholder="Mastering the Stack"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price (USD)</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 pl-12 pr-5 py-4 text-gray-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 dark:border-gray-800 dark:bg-gray-800 dark:text-white transition-all font-bold"
                        placeholder="49.99"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-gray-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 dark:border-gray-800 dark:bg-gray-800 dark:text-white transition-all font-bold appearance-none"
                    >
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-gray-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 dark:border-gray-800 dark:bg-gray-800 dark:text-white transition-all font-medium"
                  placeholder="What will students learn?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Thumbnail</label>
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                  onSuccess={(result) => setFormData(prev => ({ ...prev, thumbnail: result.info.secure_url }))}
                  options={{ folder: `educore/instructors/${user?.uid}/thumbnails` }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full h-40 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all relative overflow-hidden"
                    >
                      {formData.thumbnail ? (
                        <img src={formData.thumbnail} className="h-full w-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className="text-gray-300" size={32} />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Image</span>
                        </>
                      )}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Intro Video (Trailer)</label>
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                  onSuccess={(result) => setFormData(prev => ({ ...prev, introVideo: result.info.secure_url }))}
                  options={{ 
                    folder: `educore/instructors/${user?.uid}/trailers`,
                    resourceType: 'video'
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className={cn(
                        "w-full py-6 rounded-3xl border-2 border-dashed transition-all flex items-center justify-center gap-3",
                        formData.introVideo ? "border-emerald-500 bg-emerald-50/10 text-emerald-600" : "border-gray-100 text-gray-400 hover:bg-gray-50"
                      )}
                    >
                      {formData.introVideo ? (
                        <><CheckCircle size={20} /> Trailer Ready</>
                      ) : (
                        <><Video size={20} /> Upload Trailer</>
                      )}
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>

            {/* Right Column: Curriculum (Playlist) */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Course Curriculum</label>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">{formData.lessons.length} Lessons</span>
               </div>

               <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 group animate-in fade-in slide-in-from-right-2 duration-300">
                       <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-indigo-600 font-black shadow-sm">
                          {index + 1}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-gray-900 dark:text-white truncate">{lesson.title}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Video Uploaded</p>
                       </div>
                       <button 
                         type="button" 
                         onClick={() => removeLesson(lesson.id)}
                         className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  ))}

                  {showAddLesson ? (
                    <div className="p-6 rounded-[2rem] border-2 border-indigo-600/20 bg-indigo-50/10 space-y-4 animate-in zoom-in-95 duration-200">
                       <input 
                          type="text" 
                          placeholder="Lesson Title"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                       />
                       
                       <CldUploadWidget 
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                          onSuccess={(result) => setNewLesson(prev => ({ ...prev, videoUrl: result.info.secure_url, duration: `${Math.round(result.info.duration / 60)} min` }))}
                          options={{ 
                             folder: `educore/instructors/${user?.uid}/lessons`,
                             resourceType: 'video'
                          }}
                       >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className={cn(
                                "w-full py-4 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2",
                                newLesson.videoUrl 
                                  ? "border-emerald-500 bg-emerald-50/20 text-emerald-600" 
                                  : "border-gray-200 text-gray-400 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
                              )}
                            >
                               {newLesson.videoUrl ? <><CheckCircle size={18} /> Video Uploaded</> : <><Plus size={18} /> Upload Video Lesson</>}
                            </button>
                          )}
                       </CldUploadWidget>

                       <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setShowAddLesson(false)}
                            className="flex-1 py-3 rounded-xl text-xs font-black uppercase text-gray-400 hover:bg-gray-100 transition-all"
                          >
                             Cancel
                          </button>
                          <button 
                            type="button" 
                            onClick={handleAddLesson}
                            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                          >
                             Save Lesson
                          </button>
                       </div>
                    </div>
                  ) : (
                    <button 
                       type="button"
                       onClick={() => setShowAddLesson(true)}
                       className="w-full py-6 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center gap-3 text-gray-400 hover:text-indigo-600 hover:border-indigo-600/30 hover:bg-indigo-50/20 transition-all group"
                    >
                       <Plus size={24} className="group-hover:scale-125 transition-transform" />
                       <span className="text-sm font-black uppercase tracking-widest">Add New Lesson</span>
                    </button>
                  )}
               </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-2xl border border-gray-100 py-4 text-sm font-black text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] rounded-2xl bg-indigo-600 py-4 text-sm font-black text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all"
            >
              {initialData ? "Sync All Changes" : "Launch Course Series"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
