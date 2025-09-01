import React, { useState } from 'react';

function ProposalTemplates({ onSelectTemplate, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 'web-dev-react',
      category: 'Web Development',
      title: 'React/Frontend Development',
      description: 'For React, Vue, Angular, and frontend projects',
      preview: 'Hi [Client Name],\n\nI noticed your React development project and I\'m excited about the opportunity to help you build a modern, responsive web application...',
      tags: ['React', 'JavaScript', 'Frontend', 'Responsive Design'],
      difficulty: 'Intermediate',
      estimatedWinRate: '75%'
    },
    {
      id: 'web-dev-fullstack',
      category: 'Web Development',
      title: 'Full-Stack Development',
      description: 'Complete web applications with backend integration',
      preview: 'Hello [Client Name],\n\nYour full-stack development project caught my attention. With [X] years of experience in both frontend and backend development...',
      tags: ['Full-Stack', 'Node.js', 'Database', 'API'],
      difficulty: 'Advanced',
      estimatedWinRate: '70%'
    },
    {
      id: 'design-ui-ux',
      category: 'Design',
      title: 'UI/UX Design Project',
      description: 'User interface and experience design',
      preview: 'Hi [Client Name],\n\nI\'m excited about your UI/UX design project. Creating intuitive, user-centered designs is my passion...',
      tags: ['UI/UX', 'Figma', 'User Research', 'Prototyping'],
      difficulty: 'Intermediate',
      estimatedWinRate: '80%'
    },
    {
      id: 'design-branding',
      category: 'Design',
      title: 'Brand Identity & Logo',
      description: 'Complete branding and logo design projects',
      preview: 'Hello [Client Name],\n\nYour brand identity project is exactly the type of creative challenge I love. Building memorable brands that connect with audiences...',
      tags: ['Branding', 'Logo Design', 'Brand Strategy', 'Visual Identity'],
      difficulty: 'Intermediate',
      estimatedWinRate: '85%'
    },
    {
      id: 'marketing-seo',
      category: 'Digital Marketing',
      title: 'SEO & Content Marketing',
      description: 'Search engine optimization and content strategy',
      preview: 'Hi [Client Name],\n\nI see you\'re looking to improve your website\'s search rankings and organic traffic. With proven SEO strategies...',
      tags: ['SEO', 'Content Marketing', 'Analytics', 'Keyword Research'],
      difficulty: 'Intermediate',
      estimatedWinRate: '78%'
    },
    {
      id: 'marketing-social',
      category: 'Digital Marketing',
      title: 'Social Media Management',
      description: 'Social media strategy and management',
      preview: 'Hello [Client Name],\n\nYour social media project aligns perfectly with my expertise in building engaging online communities...',
      tags: ['Social Media', 'Content Creation', 'Community Management', 'Analytics'],
      difficulty: 'Beginner',
      estimatedWinRate: '82%'
    },
    {
      id: 'content-blog',
      category: 'Content Creation',
      title: 'Blog Writing & Content',
      description: 'Blog posts, articles, and content writing',
      preview: 'Hi [Client Name],\n\nI\'m excited about your content writing project. Creating engaging, SEO-optimized content that drives results...',
      tags: ['Blog Writing', 'SEO Content', 'Research', 'Copywriting'],
      difficulty: 'Beginner',
      estimatedWinRate: '88%'
    },
    {
      id: 'content-technical',
      category: 'Content Creation',
      title: 'Technical Writing',
      description: 'Documentation, tutorials, and technical content',
      preview: 'Hello [Client Name],\n\nYour technical writing project is right in my wheelhouse. I specialize in making complex topics accessible...',
      tags: ['Technical Writing', 'Documentation', 'API Docs', 'Tutorials'],
      difficulty: 'Advanced',
      estimatedWinRate: '75%'
    },
    {
      id: 'data-analysis',
      category: 'Data Science',
      title: 'Data Analysis & Visualization',
      description: 'Data analysis, reporting, and visualization projects',
      preview: 'Hi [Client Name],\n\nYour data analysis project caught my attention. Turning raw data into actionable insights is what I do best...',
      tags: ['Data Analysis', 'Python', 'Visualization', 'Reporting'],
      difficulty: 'Advanced',
      estimatedWinRate: '72%'
    },
    {
      id: 'mobile-app',
      category: 'Mobile Development',
      title: 'Mobile App Development',
      description: 'iOS, Android, and cross-platform mobile apps',
      preview: 'Hello [Client Name],\n\nI\'m excited about your mobile app project. Creating user-friendly, performant mobile applications...',
      tags: ['Mobile Development', 'React Native', 'iOS', 'Android'],
      difficulty: 'Advanced',
      estimatedWinRate: '68%'
    }
  ];

  const categories = ['all', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getWinRateColor = (rate) => {
    const percentage = parseInt(rate);
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">📋 Proposal Templates</h2>
              <p className="text-white/70 mt-1">Choose a template to get started with proven proposal structures</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => onSelectTemplate(template)}
              >
                {/* Template Header */}
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                      {template.title}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs ${getWinRateColor(template.estimatedWinRate)}`}>
                      {template.estimatedWinRate}
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3">{template.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white/50 text-xs">{template.category}</span>
                    <span className="text-white/30">•</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-3">
                  <div className="bg-black/20 rounded p-3 text-white/60 text-xs font-mono leading-relaxed">
                    {template.preview.substring(0, 120)}...
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-purple-200 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 rounded text-white/50 text-xs">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action */}
                <button className="w-full py-2 bg-purple-600/20 border border-purple-500/50 rounded text-purple-200 hover:bg-purple-600/30 transition-colors text-sm group-hover:border-purple-400">
                  Use This Template
                </button>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center text-white/50 py-12">
              <div className="text-4xl mb-4">📋</div>
              <div className="text-lg mb-2">No templates found</div>
              <div className="text-sm">Try selecting a different category</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/70">
              💡 Templates are starting points - customize them with your specific experience and the job requirements
            </div>
            <div className="text-white/50">
              {filteredTemplates.length} templates available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalTemplates;