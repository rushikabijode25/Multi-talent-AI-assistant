'use client';

import { useState, useCallback } from 'react';
import {
  UploadCloud, FileText, CheckCircle, XCircle, AlertCircle,
  Loader2, Sparkles, TrendingUp, Award, Target, Lightbulb,
  ChevronRight, BarChart2, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface AnalysisResult {
  atsScore: number;
  decision: string;
  feedback: string;
  seniorityLevel: string;
  matchingSkills: string[];
  missingSkills: string[];
  improvements: string[];
  experienceYears: number;
}

const DECISION_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  'Highly Recommended': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  'Recommended':        { color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/25'     },
  'Neutral':            { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25'   },
  'Needs Improvement':  { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/25'     },
};

const scoreColor = (score: number) =>
  score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';

const scoreStroke = (score: number) =>
  score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

const CIRCUMFERENCE = 2 * Math.PI * 54;

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'Extracting PDF' | 'Running NLP Engine' | 'Querying Gemini AI' | ''>('');

  const loadFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setResumeText((e.target?.result as string) || '');
    reader.readAsText(file); // For .txt demo; real PDFBox handles binary PDFs
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const simulateSteps = async () => {
    const steps: typeof step[] = ['Extracting PDF', 'Running NLP Engine', 'Querying Gemini AI'];
    for (const s of steps) {
      setStep(s);
      await new Promise(r => setTimeout(r, 900));
    }
    setStep('');
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both a resume and a job description.');
      return;
    }
    setError('');
    setResult(null);
    setIsAnalyzing(true);

    simulateSteps();

    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      if (!res.ok) throw new Error('Analysis request failed');
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setStep('');
    }
  };

  const decisionConfig = result ? (DECISION_CONFIG[result.decision] || DECISION_CONFIG['Neutral']) : null;

  return (
    <div className="min-h-full p-6 md:p-10 w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">AI Resume Analyzer</h1>
            <p className="text-neutral-500 text-sm mt-0.5">Powered by Google Gemini · Apache OpenNLP · NLP Keyword Matching</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ── LEFT INPUT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="xl:col-span-2 space-y-6"
        >
          {/* Upload Zone */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-indigo-400" /> Resume Upload
            </h2>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={clsx(
                'relative flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer',
                isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-neutral-700 hover:border-indigo-600 hover:bg-neutral-800/50'
              )}
            >
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                <UploadCloud className={clsx('w-9 h-9 mb-2 transition-colors', isDragging ? 'text-indigo-400' : 'text-neutral-500')} />
                <p className="text-sm text-neutral-400 text-center">
                  <span className="font-semibold text-white">Drag & drop</span> or click to upload
                </p>
                <p className="text-xs text-neutral-600 mt-1">PDF or TXT · Max 5MB</p>
                <input type="file" className="hidden" accept=".pdf,.txt,.doc,.docx" onChange={onFileChange} />
              </label>
            </div>

            <AnimatePresence>
              {fileName && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden"
                >
                  <div className="flex items-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-white truncate">{fileName}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual text fallback */}
            <div className="mt-4">
              <p className="text-xs text-neutral-600 mb-2">Or paste resume text directly:</p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={6}
                placeholder="Paste your resume text here..."
                className="w-full bg-neutral-800 border border-neutral-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-neutral-200 outline-none resize-none transition-colors placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4 flex items-center">
              <Target className="w-4 h-4 mr-2 text-purple-400" /> Job Description
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={7}
              placeholder="Paste the target job description here..."
              className="w-full bg-neutral-800 border border-neutral-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-neutral-200 outline-none resize-none transition-colors placeholder:text-neutral-600"
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-start p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <XCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
            className="w-full py-4 px-6 relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-600 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{step || 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run AI Analysis</span>
              </>
            )}
          </button>
        </motion.div>

        {/* ── RIGHT RESULTS PANEL ── */}
        <div className="xl:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {/* Idle State */}
            {!result && !isAnalyzing && (
              <motion.div
                key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[500px] rounded-2xl border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-neutral-600 space-y-4"
              >
                <BarChart2 className="w-16 h-16 opacity-20" />
                <div className="text-center">
                  <p className="font-medium">Your analysis will appear here</p>
                  <p className="text-sm mt-1 text-neutral-700">Fill in both fields and click "Run AI Analysis"</p>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <motion.div
                key="loading" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="min-h-[500px] rounded-2xl border border-neutral-800 bg-neutral-900 flex flex-col items-center justify-center space-y-8 p-10"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-neutral-800 border-t-indigo-500 animate-spin" />
                  <Sparkles className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-3 w-full max-w-xs">
                  {['Extracting PDF', 'Running NLP Engine', 'Querying Gemini AI'].map((s) => (
                    <div key={s} className="flex items-center space-x-3">
                      {step === s ? (
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-700 flex-shrink-0" />
                      )}
                      <span className={clsx('text-sm transition-colors', step === s ? 'text-white' : 'text-neutral-600')}>{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Results */}
            {result && !isAnalyzing && (
              <motion.div
                key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.08 }}
                className="space-y-5"
              >
                {/* Top Row — Score + Decision */}
                <div className="grid grid-cols-2 gap-5">
                  {/* ATS Score Ring */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center space-y-2">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">ATS Score</p>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" stroke="#262626" strokeWidth="10" fill="none" />
                        <motion.circle
                          cx="60" cy="60" r="54"
                          stroke={scoreStroke(result.atsScore)}
                          strokeWidth="10" fill="none"
                          strokeLinecap="round"
                          strokeDasharray={CIRCUMFERENCE}
                          strokeDashoffset={CIRCUMFERENCE}
                          animate={{ strokeDashoffset: CIRCUMFERENCE - (CIRCUMFERENCE * result.atsScore) / 100 }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className={clsx('text-3xl font-bold', scoreColor(result.atsScore))}>{result.atsScore}</span>
                        <span className="text-xs text-neutral-500 -mt-0.5">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Decision + Meta */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Decision</p>
                    {decisionConfig && (
                      <span className={clsx('inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border', decisionConfig.color, decisionConfig.bg, decisionConfig.border)}>
                        <Award className="w-4 h-4 mr-1.5" />
                        {result.decision}
                      </span>
                    )}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Seniority</span>
                        <span className="text-white font-medium">{result.seniorityLevel}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Experience</span>
                        <span className="text-white font-medium">{result.experienceYears}+ years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Skills Matched</span>
                        <span className="text-emerald-400 font-medium">{result.matchingSkills.length} / {result.matchingSkills.length + result.missingSkills.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-indigo-400" /> Gemini AI Feedback
                  </p>
                  <p className="text-neutral-300 text-sm leading-relaxed bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                    {result.feedback}
                  </p>
                </div>

                {/* NLP Skills */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-5 flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2 text-purple-400" /> NLP Skill Extraction
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Matched
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.matchingSkills.length > 0 ? result.matchingSkills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-medium">
                            {s}
                          </span>
                        )) : <span className="text-neutral-600 text-sm">None detected</span>}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Missing
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.missingSkills.length > 0 ? result.missingSkills.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-xs font-medium">
                            {s}
                          </span>
                        )) : <span className="text-emerald-400 text-sm">All required skills present ✓</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Improvements */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-amber-400" /> Actionable Improvements
                  </p>
                  <div className="space-y-3">
                    {result.improvements.map((tip, i) => (
                      <div key={i} className="flex items-start space-x-3 text-sm text-neutral-300">
                        <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
