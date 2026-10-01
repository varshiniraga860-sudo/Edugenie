import React, { useState } from 'react';
import {
  FileUp,
  Sparkles,
  UploadCloud,
  FileText,
  Copy,
  Check,
  Download,
  RefreshCw,
  FileCheck2,
  AlertCircle,
  File,
  X,
  BookOpen,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/curatedData';
import { MarkdownRenderer } from '../utils/markdownRenderer';

interface SummarizerViewProps {
  onNavigateToTab: (tab: ActiveTab, topic?: string, subject?: string, contextText?: string) => void;
  onIncrementExplored: () => void;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  onNavigateToTab,
  onIncrementExplored,
}) => {
  const [text, setText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string>('application/pdf');
  const [summaryMode, setSummaryMode] = useState<'detailed' | 'executive' | 'flashcards'>('detailed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryOutput, setSummaryOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setFileMimeType(file.type || 'application/pdf');

    const reader = new FileReader();

    // If PDF or binary
    if (file.type === 'application/pdf') {
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFileBase64(base64String);
        setText(''); // clear text when file is attached
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text or markdown
      reader.onload = () => {
        const rawContent = reader.result as string;
        setText(rawContent);
        setFileBase64(null);
      };
      reader.readAsText(file);
    }
  };

  const handleClearFile = () => {
    setUploadedFileName(null);
    setFileBase64(null);
  };

  const handleLoadSample = (sample: { title: string; content: string }) => {
    handleClearFile();
    setText(sample.content);
  };

  const handleSummarize = async () => {
    if (!text.trim() && !fileBase64) {
      setError('Please enter text or upload a document/PDF to summarize.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          fileBase64: fileBase64 || undefined,
          mimeType: fileMimeType,
          summaryMode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize document.');
      }

      setSummaryOutput(data.summary);
      onIncrementExplored();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while processing the document.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryOutput) return;
    navigator.clipboard.writeText(summaryOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summaryOutput) return;
    const blob = new Blob([summaryOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edugenie_document_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
          <FileUp className="w-3.5 h-3.5 text-purple-600" />
          <span>Document & PDF Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          PDF & Document Summarizer
        </h1>
        <p className="text-sm text-slate-600">
          Upload textbooks, research papers, syllabus chapters, or lecture slides. Extract key insights, vocabulary, and study flashcards instantly.
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        {/* Sample Docs Pill Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Try a sample document:
          </span>
          {SAMPLE_DOCUMENTS.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadSample(doc)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-xs font-medium text-slate-600 transition cursor-pointer"
            >
              📄 {doc.title}
            </button>
          ))}
        </div>

        {/* Upload Zone / Drop area */}
        <div className="relative border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-6 text-center transition bg-slate-50/50">
          <input
            type="file"
            accept=".pdf,.txt,.md,.doc"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800">
              Drag & drop educational PDF, notes, or slides
            </div>
            <p className="text-xs text-slate-500">
              Supports .pdf, .txt, .md (Processed securely with Gemini multimodal intelligence)
            </p>
          </div>
        </div>

        {/* Attached file chip if uploaded */}
        {uploadedFileName && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-purple-600" />
              <span>Attached: <strong>{uploadedFileName}</strong></span>
            </div>
            <button
              onClick={handleClearFile}
              className="p-1 rounded hover:bg-purple-100 text-purple-700 transition"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Or Text Area */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Or paste text/notes directly:
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (fileBase64) handleClearFile();
            }}
            rows={6}
            placeholder="Paste textbook excerpts, lecture transcripts, or articles here..."
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed font-mono"
          />
        </div>

        {/* Summary Mode Selection */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Output Format:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSummaryMode('detailed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  summaryMode === 'detailed'
                    ? 'bg-purple-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Comprehensive Master Summary
              </button>
              <button
                type="button"
                onClick={() => setSummaryMode('executive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  summaryMode === 'executive'
                    ? 'bg-purple-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Executive Bullets
              </button>
              <button
                type="button"
                onClick={() => setSummaryMode('flashcards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  summaryMode === 'flashcards'
                    ? 'bg-purple-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Study Flashcards (Q&A)
              </button>
            </div>
          </div>

          <button
            onClick={handleSummarize}
            disabled={loading || (!text.trim() && !fileBase64)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Reading & Summarizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Summarize Document</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Document processing error</p>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 rounded-md w-2/5"></div>
          <div className="h-4 bg-slate-100 rounded-md w-4/5"></div>
          <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-36 bg-slate-50 rounded-xl border border-slate-100"></div>
        </div>
      )}

      {/* Summary Output Display */}
      {summaryOutput && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 capitalize">
              {summaryMode} Document Summary
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Formatted Markdown */}
          <div className="prose prose-slate max-w-none">
            <MarkdownRenderer content={summaryOutput} />
          </div>

          {/* Direct CTA: Generate Quiz from Document */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Turn this document into an active recall practice quiz:
              </h4>
              <p className="text-xs text-slate-600">
                EduGenie will formulate questions testing the specific concepts in this summary.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('quiz', 'Uploaded Document Material', 'General', summaryOutput)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Generate Quiz from this Document &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
