import React from 'react';
import { Link } from 'react-router-dom';

function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">✅ Test Page Working!</h1>
        <p className="text-xl mb-8">If you can see this, routing is working correctly.</p>
        <div className="space-x-4">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Go to Home
          </Link>
          <Link 
            to="/upwork" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Go to Upwork
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
