import React, { useEffect, useState } from 'react';

function KnowledgeBaseManager({ rag, disabled }) {
  const [text, setText] = useState('');
  const [snippets, setSnippets] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSnippets(rag.list());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rag]);

  const addSnippet = async () => {
    if (!text.trim()) return;
    setIsAdding(true);
    setError('');
    try {
      const id = await rag.addSnippet(text.trim());
      setSnippets((prev) => [{ id, text: text.trim() }, ...prev]);
      setText('');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsAdding(false);
    }
  };

  const clearAll = () => {
    rag.clear();
    setSnippets([]);
  };

  const clearLocalStorage = () => {
    rag.clearStorage();
    setSnippets([]);
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 mb-8 border border-white border-opacity-20">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">📘</span>
        <h3 className="text-white text-lg font-semibold">Knowledge Base (RAG)</h3>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-3">{error}</div>
      )}

      <textarea
        className="shadow appearance-none border border-white border-opacity-30 bg-black bg-opacity-25 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-24 placeholder-white placeholder-opacity-50 backdrop-filter backdrop-blur-sm transition duration-300 ease-in-out hover:border-opacity-50"
        placeholder="Paste policy, style guide, product details, or previous emails..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />

      <div className="flex flex-wrap gap-3 mt-3">
        <button
          onClick={addSnippet}
          disabled={disabled || isAdding || !text.trim()}
          className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200"
        >
          {isAdding ? 'Adding...' : 'Add to Knowledge Base'}
        </button>
        <button
          onClick={clearAll}
          disabled={disabled || snippets.length === 0}
          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition duration-200"
        >
          Clear In-Memory
        </button>
        <button
          onClick={clearLocalStorage}
          disabled={disabled}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-200"
        >
          Clear LocalStorage
        </button>
      </div>

      <div className="mt-4">
        <div className="text-white text-sm font-semibold mb-2">Stored Snippets</div>
        <div className="border border-white border-opacity-30 rounded-lg p-4 bg-black bg-opacity-25 backdrop-filter backdrop-blur-sm h-40 overflow-auto">
          {snippets.length === 0 ? (
            <div className="text-white text-opacity-60">No snippets added yet.</div>
          ) : (
            <ul className="text-white text-sm space-y-2">
              {snippets.map((s) => (
                <li key={s.id} className="bg-white bg-opacity-5 p-2 rounded">{s.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBaseManager;
