import React, { useState } from 'react';

function CustomPromptInput({ customPrompt, setCustomPrompt }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePromptChange = (e) => {
    setCustomPrompt(e.target.value);
  };

  const clearPrompt = () => {
    setCustomPrompt('');
  };

  const promptExamples = [
    {
      title: "Make it more persuasive",
      prompt: "Make the email more persuasive and compelling to encourage action from the recipient."
    },
    {
      title: "Add specific details",
      prompt: "Add more specific details, examples, and concrete information to make the email more informative."
    },
    {
      title: "Make it more concise",
      prompt: "Make the email more concise and to-the-point while preserving all essential information."
    },
    {
      title: "Add call-to-action",
      prompt: "Add a clear and compelling call-to-action that encourages the recipient to respond or take action."
    },
    {
      title: "Professional tone",
      prompt: "Ensure the email maintains a highly professional tone suitable for business communication."
    },
    {
      title: "Friendly approach",
      prompt: "Make the email more friendly and approachable while maintaining professionalism."
    }
  ];

  const useExample = (examplePrompt) => {
    setCustomPrompt(examplePrompt);
  };

  return (
    <div className="w-full mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center text-white text-lg font-semibold">
          <span className="mr-2">🎯</span> Custom Instructions (Optional)
        </label>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white text-opacity-70 hover:text-opacity-100 transition duration-200 text-sm"
        >
          {isExpanded ? 'Hide Examples' : 'Show Examples'}
        </button>
      </div>

      <div className="relative">
        <textarea
          className="shadow appearance-none border border-white border-opacity-30 bg-black bg-opacity-25 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-24 placeholder-white placeholder-opacity-50 backdrop-filter backdrop-blur-sm transition duration-300 ease-in-out hover:border-opacity-50 resize-none"
          value={customPrompt}
          onChange={handlePromptChange}
          placeholder="Add custom instructions for AI to follow when processing your email..."
        />
        {customPrompt && (
          <button
            onClick={clearPrompt}
            className="absolute top-2 right-2 text-white text-opacity-50 hover:text-opacity-100 transition duration-200"
            title="Clear custom prompt"
          >
            ✕
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-20">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Quick Examples
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {promptExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => useExample(example.prompt)}
                className="text-left p-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 hover:bg-opacity-20 transition duration-200 group"
              >
                <div className="text-white font-medium text-sm mb-1 group-hover:text-blue-300 transition duration-200">
                  {example.title}
                </div>
                <div className="text-white text-opacity-70 text-xs line-clamp-2">
                  {example.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {customPrompt && (
        <div className="mt-3 text-xs text-white text-opacity-70">
          <span className="mr-2">📝</span>
          Custom instructions will be added to the AI prompt for enhanced email processing
        </div>
      )}
    </div>
  );
}

export default CustomPromptInput;
