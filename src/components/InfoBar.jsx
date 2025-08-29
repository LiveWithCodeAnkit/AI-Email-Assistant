import React from 'react';

function InfoBar() {
  return (
    <div className="glass-card p-4 mb-6 rounded-xl border border-white border-opacity-20">
      <div className="flex items-start gap-3 text-sm">
        <div className="text-xl">ℹ️</div>
        <div className="space-y-1 opacity-90">
          <div><strong>How to use:</strong> Type a rough draft → choose recipient → (optional) add custom instructions → generate.</div>
          <div><strong>Templates:</strong> Scroll down to "Select Email Purpose" to pick a template that matches your scenario.</div>
          <div><strong>Tip:</strong> Adjusted Email shows a formatted preview with subject and body like a real email.</div>
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
