import React from 'react';

function EmailInput({ email, setEmail }) {
  return (
    <div className="w-full mb-6 animate-fade-in">
      <label className="flex items-center text-white text-lg font-semibold mb-3">
        <span className="mr-2">📝</span> Your Draft Email
      </label>
      <div className="relative">
        <textarea
          className="shadow appearance-none border border-white border-opacity-30 bg-black bg-opacity-25 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-40 placeholder-white placeholder-opacity-50 backdrop-filter backdrop-blur-sm transition duration-300 ease-in-out hover:border-opacity-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your draft email here..."
        />
        <div className="absolute bottom-3 right-3 text-xs text-white text-opacity-50">
          {email.length} characters
        </div>
      </div>
    </div>
  );
}

export default EmailInput;