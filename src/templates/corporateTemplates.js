// Corporate email templates usable across departments and regions
// Each template includes id, title, category, description, placeholders, and a generator function

export const CORPORATE_CATEGORIES = [
  'To-Do Update',
  'Daily Update',
  'Progress Update',
  'Client Communication',
  'Status Update',
  'Question / Clarification',
  'Meeting Follow-up',
  'Request',
  'General'
];

export const corporateTemplates = [
  {
    id: 'todo-update-checklist',
    title: 'To-Do Update: Checklist of Completed Tasks',
    category: 'To-Do Update',
    description: 'Share a quick checklist of completed and pending items',
    placeholders: ['date', 'completedItems[]', 'pendingItems[]', 'blockers[]'],
    generate: ({ date = 'today', completedItems = [], pendingItems = [], blockers = [] }) => {
      const formatList = (items) => items.length ? items.map((i) => `- ${i}`).join('\n') : '- None';
      return `Subject: To-Do Update — ${date}

Hello [Recipient's Name],

Here is my to-do update for ${date}:

Completed:
${formatList(completedItems)}

In Progress / Pending:
${formatList(pendingItems)}

Blockers / Risks:
${formatList(blockers)}

Please let me know if any adjustments are needed.

Regards,
[Your Name]`;
    }
  },
  {
    id: 'daily-work-update',
    title: 'Daily Work Update to Manager',
    category: 'Daily Update',
    description: 'Concise summary of daily accomplishments and next focus',
    placeholders: ['date', 'highlights[]', 'nextFocus[]', 'helpNeeded[]'],
    generate: ({ date = 'today', highlights = [], nextFocus = [], helpNeeded = [] }) => {
      const fmt = (arr) => arr.length ? arr.map((t) => `- ${t}`).join('\n') : '- N/A';
      return `Subject: Daily Update — ${date}

Hi [Manager's Name],

Summary of today (${date}):

Highlights:
${fmt(highlights)}

Next Focus:
${fmt(nextFocus)}

Help/Dependencies:
${fmt(helpNeeded)}

Thanks,
[Your Name]`;
    }
  },
  {
    id: 'client-status-update',
    title: 'Client Status Update',
    category: 'Client Communication',
    description: 'Professional update for client on current status and next steps',
    placeholders: ['projectName', 'currentStatus', 'milestones[]', 'nextSteps[]', 'eta'],
    generate: ({ projectName = 'the project', currentStatus = 'on track', milestones = [], nextSteps = [], eta = 'TBD' }) => {
      const list = (arr) => arr.length ? arr.map((x) => `- ${x}`).join('\n') : '- N/A';
      return `Subject: ${projectName} — Status Update

Dear [Client Name],

I hope you are well. Here is a brief update on ${projectName}:

Current Status: ${currentStatus}

Recent Milestones:
${list(milestones)}

Next Steps:
${list(nextSteps)}

Estimated Timeline: ${eta}

Please let us know if you have any questions or require additional details.

Best regards,
[Your Name]
[Company Name]`;
    }
  },
  {
    id: 'internal-question',
    title: 'Internal Question / Clarification',
    category: 'Question / Clarification',
    description: 'Clear question with context and expected outcome',
    placeholders: ['topic', 'context', 'question', 'deadline'],
    generate: ({ topic = 'the topic', context = 'brief context', question = 'your question', deadline = 'no strict deadline' }) => {
      return `Subject: Clarification on ${topic}

Hello [Recipient's Name],

Context:
${context}

Question:
${question}

If possible, please share guidance by ${deadline}.

Thank you,
[Your Name]`;
    }
  },
  {
    id: 'meeting-follow-up',
    title: 'Meeting Follow-Up with Action Items',
    category: 'Meeting Follow-up',
    description: 'Summarize decisions and action items after a meeting',
    placeholders: ['meetingTitle', 'date', 'decisions[]', 'actions[]', 'ownerAssignments[]'],
    generate: ({ meetingTitle = 'our meeting', date = 'today', decisions = [], actions = [], ownerAssignments = [] }) => {
      const list = (arr) => arr.length ? arr.map((x) => `- ${x}`).join('\n') : '- N/A';
      return `Subject: Follow-Up: ${meetingTitle} — ${date}

Hi all,

Thanks for your time in ${meetingTitle}. Summary below:

Key Decisions:
${list(decisions)}

Action Items:
${list(actions)}

Owners:
${list(ownerAssignments)}

Please confirm if anything needs correction.

Regards,
[Your Name]`;
    }
  },
  {
    id: 'status-update-brief',
    title: 'Brief Status Update (Internal)',
    category: 'Status Update',
    description: 'Short internal update with key points and ETA',
    placeholders: ['workstream', 'updates[]', 'risks[]', 'eta'],
    generate: ({ workstream = 'the workstream', updates = [], risks = [], eta = 'TBD' }) => {
      const list = (arr) => arr.length ? arr.map((x) => `- ${x}`).join('\n') : '- None';
      return `Subject: ${workstream} — Brief Status

Hello [Team/Manager],

Updates:
${list(updates)}

Risks/Blockers:
${list(risks)}

ETA: ${eta}

Thanks,
[Your Name]`;
    }
  }
];

export function findTemplateById(id) {
  return corporateTemplates.find((t) => t.id === id);
}
