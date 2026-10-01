import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split into lines
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockBuffer: string[] = [];

  let inList = false;
  let listItems: string[] = [];
  let isNumberedList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-3 space-y-1.5 pl-6 list-decimal text-slate-700">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-3 space-y-1.5 pl-6 list-disc text-slate-700">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed marker:text-blue-500">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockBuffer.length > 0) {
      const codeText = codeBlockBuffer.join('\n');
      elements.push(
        <CodeBlockView key={`code-${elements.length}`} code={codeText} language={codeBlockLanguage} />
      );
      codeBlockBuffer = [];
      codeBlockLanguage = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block delimiters
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLanguage = trimmed.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(rawLine);
      continue;
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || isNumberedList) {
        flushList();
        inList = true;
        isNumberedList = false;
      }
      listItems.push(trimmed.substring(2));
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (!inList || !isNumberedList) {
        flushList();
        inList = true;
        isNumberedList = true;
      }
      listItems.push(numMatch[2]);
      continue;
    }

    // Not in a list anymore
    if (inList) {
      flushList();
    }

    // Empty line
    if (!trimmed) {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="mt-6 mb-3 text-2xl md:text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
          {renderInlineFormatting(trimmed.substring(2))}
        </h1>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="mt-5 mb-2.5 text-xl md:text-2xl font-semibold text-slate-800 flex items-center gap-2">
          {renderInlineFormatting(trimmed.substring(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="mt-4 mb-2 text-lg font-semibold text-blue-900">
          {renderInlineFormatting(trimmed.substring(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="mt-3 mb-1.5 text-base font-semibold text-slate-800">
          {renderInlineFormatting(trimmed.substring(5))}
        </h4>
      );
      continue;
    }

    // Blockquote or Callout
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s?/, '');
      elements.push(
        <div key={`quote-${i}`} className="my-3 border-l-4 border-blue-500 bg-blue-50/70 p-3.5 rounded-r-lg text-slate-800 text-sm md:text-base leading-relaxed">
          {renderInlineFormatting(quoteText)}
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="my-2 text-slate-700 leading-relaxed text-sm md:text-base">
        {renderInlineFormatting(rawLine)}
      </p>
    );
  }

  flushList();
  flushCodeBlock();

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};

// Inline bold, italic, code, links
function renderInlineFormatting(text: string): React.ReactNode {
  // Split on bold **text**
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs md:text-sm text-blue-700 border border-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Code block view with copy button
const CodeBlockView: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-xs font-mono text-slate-400 border-b border-slate-700">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition text-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};
