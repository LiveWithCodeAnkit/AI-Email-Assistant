import React, { useState } from 'react';

const sections = [
  {
    title: 'General Best Practices',
    items: [
      'Use clear, concise subject lines (include project, date, or action needed).',
      'Lead with the purpose in the first 1–2 sentences.',
      'Use short paragraphs and bullet points for readability.',
      'State deadlines, owners, and next steps explicitly.',
      'Be polite and professional; avoid slang and ambiguous phrasing.',
      'Proofread for tone, grammar, and correctness before sending.'
    ]
  },
  {
    title: 'Global & Cross-Cultural Considerations',
    items: [
      'Avoid idioms, culture-specific references, and humor that may not translate.',
      'Prefer 24-hour time and ISO-like date formats (e.g., 2025-08-29).',
      'Be explicit with time zones when mentioning times (e.g., 15:00 IST / 09:30 CET).',
      'Use names and titles respectfully; when unsure, use formal salutations.',
      'Keep acronyms expanded at least once (e.g., Key Performance Indicators (KPIs)).'
    ]
  },
  {
    title: 'Client Communications',
    items: [
      'Acknowledge receipt promptly; set expectations for follow-up timelines.',
      'Summarize current status, key updates, and next steps clearly.',
      'Avoid overpromising; offer realistic timelines and options.',
      'Document decisions and approvals in writing.'
    ]
  },
  {
    title: 'Status & Progress Updates',
    items: [
      'Provide highlights, risks/blockers, and ETAs in bullet points.',
      'Link related documents or tickets where helpful.',
      'Call out where leadership input or decisions are needed.'
    ]
  },
  {
    title: 'Questions & Clarifications',
    items: [
      'Provide concise context before asking the question.',
      'Ask specific, actionable questions (avoid open-ended when a decision is needed).',
      'Offer 1–2 proposed options if appropriate.'
    ]
  }
];

function CorporateGuidelines() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 mb-8 border border-white border-opacity-20 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold flex items-center">
          <span className="mr-2">🏢</span> Corporate Email Best Practices
        </h3>
        <button
          className="text-white text-opacity-70 hover:text-opacity-100 text-sm"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, idx) => (
            <div key={idx} className="p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-20">
              <div className="text-white font-medium mb-2">{section.title}</div>
              <ul className="list-disc list-inside text-white text-opacity-80 text-sm space-y-1">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CorporateGuidelines;
