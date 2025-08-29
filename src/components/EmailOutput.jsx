import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

function EmailOutput({ originalEmail, adjustedEmail, isLoading, error }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(adjustedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractSubject = (text) => {
    const m = /^Subject:\s*(.+)$/im.exec(text || '');
    return m ? m[1].trim() : 'Subject';
  };

  const panelHeight = expanded ? 'h-[36rem]' : 'h-80';
  const resizableClasses = `${panelHeight} min-h-64 resize-y overflow-auto`;

  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full">
          <h3 className="flex items-center text-white text-lg font-semibold mb-3">
            <span className="mr-2">📄</span> Original Email
          </h3>
          <div className={`border border-white border-opacity-30 rounded-xl p-4 bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm transition-all duration-300 hover:border-opacity-50 shadow-inner ${resizableClasses}`} style={{ maxHeight: '80vh' }}>
            {originalEmail ? (
              <pre className="whitespace-pre-wrap text-white text-opacity-90">{originalEmail}</pre>
            ) : (
              <div className="text-white text-opacity-60 italic">Your original email will appear here ✍️</div>
            )}
          </div>
        </div>
        
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center text-white text-lg font-semibold">
              <span className="mr-2">📬</span> Adjusted Email
            </h3>
            <div className="flex items-center gap-2">
              <button
                className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm font-semibold py-2 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition"
                onClick={() => setExpanded((v) => !v)}
                title={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? 'Collapse' : 'Expand'}
              </button>
              {adjustedEmail && (
                <button
                  className={`${copied ? 'bg-green-500' : 'bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600'} 
                    text-white text-sm font-semibold py-2 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 
                    focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2`}
                  onClick={handleCopy}
                >
                  <span>{copied ? '✅ Copied' : '📋 Copy'}</span>
                </button>
              )}
            </div>
          </div>
          <div className={`border border-white border-opacity-30 rounded-xl bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-opacity-50 shadow-inner ${resizableClasses}`} style={{ maxHeight: '80vh' }}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500 mb-3"></div>
                <div className="text-white">Transforming your email...</div>
              </div>
            ) : error ? (
              <div className="p-4 text-red-400 flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            ) : adjustedEmail ? (
              <div className="text-white flex flex-col h-full">
                <div className="px-4 py-3 border-b border-white border-opacity-10 bg-white bg-opacity-5 flex items-center justify-between">
                  <div className="font-semibold truncate pr-4">{extractSubject(adjustedEmail)}</div>
                  <div className="text-xs opacity-70">Draft Preview</div>
                </div>
                <div className="px-4 py-3 text-sm border-b border-white border-opacity-10">
                  <div><span className="opacity-70">To:</span> [Recipient]</div>
                  <div><span className="opacity-70">From:</span> [You]</div>
                </div>
                <div className="p-4 flex-1 overflow-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      ul: ({ children }) => <ul className="list-disc ml-6 my-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-6 my-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-400 pl-3 my-3 opacity-90">{children}</blockquote>,
                      code: ({ inline, children }) => inline ? (
                        <code className="bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-1 py-0.5">{children}</code>
                      ) : (
                        <pre className="bg-black bg-opacity-40 border border-white border-opacity-20 rounded p-3 overflow-auto"><code>{children}</code></pre>
                      )
                    }}
                  >
                    {adjustedEmail}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="p-4 text-white text-opacity-60 italic h-full">Your adjusted email will appear here ✨</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailOutput;