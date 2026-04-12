'use client';

import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function ResumeAnalyzerDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number, feedback: string, matchingSkills: string[], missingSkills: string[] } | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate backend NLP & Gemini API Processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        score: 87,
        feedback: 'Excellent resume structure with measurable impact metrics. Strong alignment with Backend/Full-Stack Engineering roles. Lacks explicit demonstration of CI/CD pipeline automation.',
        matchingSkills: ['Java', 'Spring Boot', 'React', 'Generative AI', 'NLP', 'Next.js'],
        missingSkills: ['Kubernetes', 'Docker', 'Jenkins', 'Terraform']
      });
    }, 3500);
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-indigo-500" />
          AI Resume Analyzer
        </h1>
        <p className="text-neutral-400 mt-2">Upload a resume to instantly evaluate ATS fit via NLP and Generative AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h2 className="text-lg font-semibold text-white mb-4">Document Upload</h2>
            
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-700 rounded-xl cursor-pointer hover:bg-neutral-800/50 hover:border-indigo-500 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-neutral-500 group-hover:text-indigo-400 transition-colors" />
                <p className="mb-2 text-sm text-neutral-400"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-neutral-500">PDF, DOCX (Max 5MB)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
            </label>

            <AnimatePresence>
              {file && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                  className="mt-4 p-4 bg-neutral-800/80 rounded-lg flex items-center justify-between border border-neutral-700"
                >
                  <div className="flex items-center truncate">
                    <FileText className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                    <span className="text-sm text-white truncate">{file.name}</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-2" />
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleAnalyze} 
              disabled={!file || isAnalyzing}
              className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing NLP & ATS...</>
              ) : 'Run AI Analysis'}
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !isAnalyzing && (
             <div className="h-full min-h-[400px] border-2 border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-500 bg-surface/30">
               <FileText className="w-16 h-16 mb-4 opacity-20" />
               <p>Upload a resume to see actionable insights</p>
             </div>
          )}

          {isAnalyzing && (
            <div className="h-full min-h-[400px] border border-neutral-800 bg-surface rounded-2xl flex flex-col items-center justify-center space-y-6">
              <div className="relative flex items-center justify-center">
                 <div className="w-24 h-24 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin"></div>
                 <Sparkles className="w-8 h-8 text-indigo-400 absolute animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                 <h3 className="text-xl font-medium text-white">Gemini AI is processing...</h3>
                 <p className="text-neutral-400">Extracting skills using Apache OpenNLP heuristics</p>
              </div>
            </div>
          )}

          {result && !isAnalyzing && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 gap-6">
              
              {/* Score Card */}
              <div className="col-span-2 md:col-span-1 bg-surface border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <TrendingUp className="w-32 h-32 text-indigo-500" />
                 </div>
                 <h2 className="text-lg font-semibold text-white mb-6">ATS Match Score</h2>
                 <div className="flex items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                         <circle cx="80" cy="80" r="70" className="text-neutral-800 stroke-current" strokeWidth="12" fill="transparent" />
                         <circle 
                           cx="80" cy="80" r="70" 
                           className={clsx("stroke-current transition-all duration-1000 ease-out", result.score > 80 ? "text-emerald-500" : "text-amber-500")}
                           strokeWidth="12" fill="transparent" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * result.score) / 100} strokeLinecap="round" 
                         />
                       </svg>
                       <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-bold text-white">{result.score}%</span>
                          <span className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Excellent</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Feedback Card */}
              <div className="col-span-2 md:col-span-1 bg-surface border border-neutral-800 rounded-2xl p-6 shadow-xl">
                 <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-indigo-400 mr-2" />
                    AI Feedback
                 </h2>
                 <p className="text-neutral-300 leading-relaxed text-sm bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/80">
                   {result.feedback}
                 </p>
              </div>

              {/* Skills Extraction */}
              <div className="col-span-2 bg-surface border border-neutral-800 rounded-2xl p-6 shadow-xl">
                 <h2 className="text-lg font-semibold text-white mb-6">NLP Skill Extraction</h2>
                 
                 <div className="space-y-6">
                   <div>
                     <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" /> Matching Skills
                     </h3>
                     <div className="flex flex-wrap gap-2">
                       {result.matchingSkills.map(s => (
                         <span key={s} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-sm font-medium">
                           {s}
                         </span>
                       ))}
                     </div>
                   </div>

                   <div>
                     <h3 className="text-sm font-medium text-amber-400 mb-3 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" /> Missing Keywords
                     </h3>
                     <div className="flex flex-wrap gap-2">
                       {result.missingSkills.map(s => (
                         <span key={s} className="px-3 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-sm font-medium">
                           {s}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
              </div>

            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
