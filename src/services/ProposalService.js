import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

class ProposalService {
  constructor() {
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.proposalStrategies = this.initializeProposalStrategies();
    this.industryKeywords = this.initializeIndustryKeywords();
  }

  initializeProposalStrategies() {
    return {
      'fullstack': {
        approach: 'technical-solution-focused',
        keyPoints: ['technical architecture', 'scalability', 'performance optimization', 'code quality'],
        openingStyle: 'problem-solving',
        closingStyle: 'technical-confidence'
      },
      'graphic': {
        approach: 'creative-visual-focused',
        keyPoints: ['visual impact', 'brand consistency', 'user experience', 'creative process'],
        openingStyle: 'creative-understanding',
        closingStyle: 'portfolio-showcase'
      },
      'digital': {
        approach: 'results-roi-focused',
        keyPoints: ['ROI metrics', 'conversion rates', 'growth strategies', 'data-driven decisions'],
        openingStyle: 'business-impact',
        closingStyle: 'results-promise'
      },
      'content': {
        approach: 'engagement-storytelling-focused',
        keyPoints: ['audience engagement', 'content strategy', 'brand voice', 'SEO optimization'],
        openingStyle: 'audience-connection',
        closingStyle: 'content-value'
      },
      'others': {
        approach: 'value-delivery-focused',
        keyPoints: ['client success', 'quality delivery', 'communication', 'problem-solving'],
        openingStyle: 'professional-understanding',
        closingStyle: 'partnership-focused'
      }
    };
  }

  initializeIndustryKeywords() {
    return {
      'fullstack': [
        'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
        'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'Git', 'Agile', 'TDD', 'Performance Optimization', 'Security'
      ],
      'graphic': [
        'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Sketch', 'Brand Identity', 'Logo Design',
        'UI/UX Design', 'Print Design', 'Digital Marketing Materials', 'Typography', 'Color Theory', 'Layout Design'
      ],
      'digital': [
        'Google Ads', 'Facebook Ads', 'SEO', 'SEM', 'Content Marketing', 'Social Media Marketing', 'Email Marketing',
        'Analytics', 'Conversion Optimization', 'Lead Generation', 'Marketing Automation', 'ROI Tracking', 'A/B Testing'
      ],
      'content': [
        'Content Strategy', 'SEO Writing', 'Blog Writing', 'Copywriting', 'Technical Writing', 'Social Media Content',
        'Email Marketing', 'Content Calendar', 'Keyword Research', 'Content Optimization', 'Brand Voice', 'Storytelling'
      ],
      'others': [
        'Project Management', 'Communication', 'Problem Solving', 'Quality Assurance', 'Client Relations', 'Time Management',
        'Attention to Detail', 'Adaptability', 'Continuous Learning', 'Professional Development'
      ]
    };
  }

  async generateProposal(apiKey, formData) {
    try {
      const prompt = this.buildProposalPrompt(formData);

      // Use LangChain for proposal generation
      const llm = new ChatOpenAI({
        apiKey,
        model: formData.model || 'gpt-4',
        temperature: 0.7,
        maxTokens: formData.highQuality ? 2000 : 1500,
      });

      const messages = [
        new SystemMessage(`You are an expert Upwork proposal writer with years of experience helping freelancers win projects. You understand the psychology of clients and know how to craft compelling proposals that stand out from the competition.

CRITICAL: Always format your response with proper structure, clear sections, line breaks, and professional formatting. Use markdown headers (##) for sections and ensure proper spacing between paragraphs. The proposal must be well-organized and easy to read.`),
        new HumanMessage(prompt)
      ];

      const response = await llm.invoke(messages);
      return response.content.trim();
    } catch (error) {
      console.error('Proposal generation error:', error);
      throw error;
    }
  }

  async analyzeClientReviews(apiKey, clientName, reviews) {
    try {
      const prompt = this.buildReviewAnalysisPrompt(clientName, reviews);

      // Use LangChain for review analysis
      const llm = new ChatOpenAI({
        apiKey,
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 1500,
      });

      const messages = [
        new SystemMessage(`You are an expert analyst specializing in understanding client behavior and preferences from their reviews and feedback. You help freelancers understand what clients value most and how to tailor their proposals accordingly.`),
        new HumanMessage(prompt)
      ];

      const response = await llm.invoke(messages);
      return response.content.trim();
    } catch (error) {
      console.error('Review analysis error:', error);
      throw error;
    }
  }

  buildProposalPrompt(formData) {
    const profileLabels = {
      'fullstack': 'Full Stack Developer',
      'graphic': 'Graphic Designer',
      'digital': 'Digital Marketer',
      'content': 'Content Creator',
      'others': 'Professional Freelancer'
    };

    // Analyze the job posting for key patterns found in real Upwork jobs
    const jobAnalysis = this.analyzeRealUpworkPatterns(formData.jobRequirements);

    const toneInstructions = {
      'professional': 'Use a formal, business-like tone with professional language and industry terminology.',
      'friendly': 'Use a warm, approachable tone while maintaining professionalism and building rapport.',
      'default': 'Use a balanced tone that is both professional and personable, showing expertise with accessibility.'
    };

    const lengthInstructions = {
      'detailed': 'Write a comprehensive proposal (350-450 words) with detailed explanations, specific examples, and thorough project understanding.',
      'medium': 'Write a balanced proposal (250-350 words) with key points covered, relevant examples, and clear value proposition.',
      'short': 'Write a concise proposal (150-250 words) focusing on essential points, immediate value, and strong call-to-action.'
    };

    const profileLabel = profileLabels[formData.profile] || 'Professional Freelancer';
    const strategy = this.proposalStrategies[formData.profile] || this.proposalStrategies.others;
    const toneInstruction = toneInstructions[formData.proposalTone] || toneInstructions.default;
    const lengthInstruction = lengthInstructions[formData.proposalLength] || lengthInstructions.medium;

    // Get relevant industry keywords
    const relevantKeywords = this.getRelevantKeywords(formData.profile, formData.keywords);

    let prompt = `You are an expert Upwork proposal writer with a 90%+ win rate, specializing in ${profileLabel} positions. Create a compelling, personalized proposal that follows the ${strategy.approach} approach and addresses the specific patterns found in this job posting.

**CRITICAL SUCCESS FACTORS:**
${toneInstruction}
${lengthInstruction}

**REAL UPWORK JOB ANALYSIS:**
${jobAnalysis.summary}

**PROPOSAL STRATEGY (${strategy.approach}):**
- Opening Style: ${strategy.openingStyle}
- Key Focus Areas: ${strategy.keyPoints.join(', ')}
- Closing Style: ${strategy.closingStyle}
- Client Type: ${jobAnalysis.clientType}
- Project Urgency: ${jobAnalysis.urgency}
- Budget Sensitivity: ${jobAnalysis.budgetMentioned ? 'High' : 'Standard'}

**FREELANCER PROFILE:**
- Profile Type: ${profileLabel}
- Experience Level: ${formData.experience ? `${formData.experience} years of professional experience` : 'Experienced professional'}
- Core Skills: ${formData.keywords.filter(k => k.trim()).join(', ') || 'Not specified'}
- Portfolio Evidence: ${formData.portfolioLinks.filter(p => p.trim()).length > 0 ? 'Available portfolio links provided' : 'Portfolio available upon request'}
- Relevant Keywords: ${relevantKeywords.join(', ')}
- Client Name: ${formData.clientName || 'Not specified'}

**FREELANCER BACKGROUND:**
${formData.aboutYou}

**JOB REQUIREMENTS ANALYSIS:**
${formData.jobRequirements}

**IDENTIFIED PROJECT NEEDS:**
${jobAnalysis.keyRequirements.length > 0 ? jobAnalysis.keyRequirements.join('\n') : 'Standard project requirements'}

**CLIENT BEHAVIOR INSIGHTS:**
${jobAnalysis.clientInsights}

**ADVANCED PROPOSAL INSTRUCTIONS (Based on Real Upwork Success Patterns):**

1. **HOOK OPENING (First 2 sentences):**
   - Reference specific technical requirements mentioned (e.g., "Node.js script with RESTful API")
   - Show immediate understanding of their main challenge/goal
   - Use ${strategy.openingStyle} approach
   - Address the client by name if provided: "${formData.clientName || 'Hi there'}"

2. **CREDIBILITY SECTION:**
   - Highlight 2-3 most relevant experiences that directly match their tech stack
   - Include specific metrics: "Built 15+ Node.js applications" or "Reduced API response time by 40%"
   - Mention exact technologies they requested (React, JavaScript, PostgreSQL, etc.)
   - Reference similar project complexity and scope

3. **SOLUTION APPROACH:**
   - Outline your specific methodology for their exact requirements
   - Address technical challenges: "I'll implement proper error handling and logging to PostgreSQL"
   - Show understanding of their environment: "Optimized for Linux deployment"
   - Mention best practices: "Following RESTful API standards and security protocols"

4. **VALUE PROPOSITION:**
   - Focus on business outcomes: "Reliable, scalable solution that grows with your needs"
   - Quantify technical benefits: "Clean, maintainable code with comprehensive documentation"
   - Address their timeline and budget concerns appropriately
   - Differentiate with unique expertise or approach

5. **SOCIAL PROOF & PORTFOLIO:**
   - Reference similar successful projects: "Recently completed a similar Node.js API project"
   - Mention relevant experience with their tech stack
   - Include portfolio links that showcase similar work
   - Highlight any relevant certifications or specializations

6. **PROJECT UNDERSTANDING:**
   - Demonstrate you've read the full job posting carefully
   - Address specific requirements: "I understand you need both file logging and PostgreSQL integration"
   - Show awareness of project scope and complexity
   - Mention any questions or clarifications needed

7. **NEXT STEPS & CTA:**
   - Use ${strategy.closingStyle} approach
   - Suggest specific next step: "I'd love to discuss the API specifications in detail"
   - Show availability: "Available to start immediately" or "Can deliver within your timeline"
   - Professional closing with enthusiasm

**QUALITY REQUIREMENTS:**
- Avoid generic phrases like "I am writing to express my interest"
- Don't repeat information already in your Upwork profile
- Use industry-specific terminology naturally
- Address the client by name if mentioned in job posting
- Include 2-3 relevant questions that show deep thinking about their project
- Ensure every sentence adds value and moves toward the hire decision
- Use active voice and confident language
- Include subtle urgency without being pushy

**PERSONALIZATION ELEMENTS:**
- Reference their company/project name if mentioned
- Show you've researched their business/industry
- Align your communication style with their job posting tone
- Address specific pain points or challenges mentioned

**CRITICAL FORMATTING REQUIREMENTS:**
- Use clear section headers (e.g., "## Understanding Your Project", "## My Approach", "## Why Choose Me")
- Use short paragraphs (2-3 sentences max) with proper line breaks
- Include bullet points for technical skills/deliverables
- Add blank lines between sections for readability
- End with a professional signature line
- Use proper spacing and structure for easy reading

**EXACT OUTPUT FORMAT REQUIRED:**
Subject: [Compelling subject line]

[Opening paragraph - hook and understanding]

## Understanding Your Project
[Show project comprehension]

## My Approach
[Technical solution and methodology]

## Why Choose Me
[Credibility and relevant experience]

## What You'll Get
[Deliverables and value proposition]

## Next Steps
[Call to action and availability]

Best regards,
[Professional signature]

Generate a winning proposal that demonstrates expertise, builds trust, and compels the client to respond:`;

    return prompt;
  }

  analyzeJobRequirements(jobDescription) {
    const requirements = [];
    const urgencyKeywords = ['urgent', 'asap', 'immediately', 'rush', 'quick turnaround'];
    const budgetKeywords = ['budget', 'cost', 'price', 'affordable', 'premium'];
    const qualityKeywords = ['quality', 'professional', 'expert', 'experienced', 'skilled'];

    // Extract key requirements (simplified analysis)
    if (jobDescription.toLowerCase().includes('experience')) {
      requirements.push('- Client values experience and proven track record');
    }
    if (urgencyKeywords.some(keyword => jobDescription.toLowerCase().includes(keyword))) {
      requirements.push('- Time-sensitive project requiring quick delivery');
    }
    if (budgetKeywords.some(keyword => jobDescription.toLowerCase().includes(keyword))) {
      requirements.push('- Budget considerations are important to client');
    }
    if (qualityKeywords.some(keyword => jobDescription.toLowerCase().includes(keyword))) {
      requirements.push('- High-quality deliverables are priority');
    }

    return {
      keyRequirements: requirements,
      hasUrgency: urgencyKeywords.some(keyword => jobDescription.toLowerCase().includes(keyword)),
      mentionsBudget: budgetKeywords.some(keyword => jobDescription.toLowerCase().includes(keyword))
    };
  }

  getRelevantKeywords(profile, userKeywords) {
    const industryKeywords = this.industryKeywords[profile] || this.industryKeywords.others;
    const userKeywordsList = userKeywords.filter(k => k.trim());

    // Combine user keywords with relevant industry keywords
    const combined = [...userKeywordsList];

    // Add industry keywords that aren't already included
    industryKeywords.forEach(keyword => {
      if (!combined.some(uk => uk.toLowerCase().includes(keyword.toLowerCase()))) {
        combined.push(keyword);
      }
    });

    return combined.slice(0, 15); // Limit to top 15 most relevant
  }

  buildReviewAnalysisPrompt(clientName, reviews) {
    return `You are an expert client behavior analyst specializing in Upwork freelancer-client relationships. Analyze the following reviews/feedback to create a comprehensive client profile that will help freelancers craft winning proposals.

**ANALYSIS FRAMEWORK:**
1. Communication patterns and preferences
2. Decision-making factors and priorities  
3. Common pain points and frustrations
4. Success indicators and satisfaction drivers
5. Proposal response triggers
6. Red flags and deal-breakers

**CLIENT REVIEWS/FEEDBACK:**
${reviews}

**REQUIRED OUTPUT FORMAT:**

**CLIENT PROFILE ANALYSIS**

**Client Name:** ${clientName || 'Unknown'}

**Communication Style & Preferences:**
- Preferred communication frequency: [Daily/Weekly/As-needed]
- Response time expectations: [Immediate/Same-day/24-48 hours]
- Communication tone: [Formal/Casual/Direct/Collaborative]
- Preferred channels: [Upwork messages/Email/Video calls/Phone]
- Detail level preference: [High-level overview/Detailed updates/Milestone-based]

**Core Values & Priorities:**
- Primary success metrics: [Quality/Speed/Cost/Communication/Innovation]
- Decision-making factors: [Price/Experience/Portfolio/Reviews/Availability]
- Project management style: [Hands-on/Collaborative/Hands-off/Milestone-driven]
- Quality expectations: [Perfectionist/Pragmatic/Good-enough/Excellence-focused]

**Pain Points & Frustrations:**
- Common complaints about freelancers: [List specific issues mentioned]
- Project challenges they've faced: [Communication gaps/Missed deadlines/Quality issues]
- Budget concerns: [Cost overruns/Value for money/Scope creep]
- Timeline pressures: [Unrealistic expectations/Seasonal demands/Market pressures]

**Success Indicators:**
- What makes them leave positive reviews: [Specific behaviors and outcomes]
- Freelancer qualities they appreciate most: [Skills/Attitude/Process/Results]
- Project outcomes they celebrate: [On-time delivery/Exceeded expectations/Problem-solving]

**Proposal Strategy Recommendations:**

**Opening Hook Strategy:**
- Best approach: [Problem-focused/Solution-focused/Results-focused/Relationship-focused]
- Key phrases to include: [Specific terminology they use frequently]
- Tone to match: [Professional/Friendly/Confident/Consultative]

**Content Priorities:**
1. [Most important element to highlight first]
2. [Second priority element]
3. [Third priority element]

**Red Flags to Avoid:**
- Communication styles that irritate them: [Specific examples]
- Proposal elements that turn them off: [Generic responses/Pushy sales/Unrealistic promises]
- Freelancer behaviors they've criticized: [Poor communication/Missed deadlines/Quality issues]

**Winning Keywords & Phrases:**
- Technical terms they use: [Industry-specific language]
- Value propositions that resonate: [ROI/Quality/Speed/Innovation/Partnership]
- Emotional triggers: [Trust/Reliability/Expertise/Results/Peace of mind]

**Proposal Tailoring Tactics:**
- Emphasize: [Specific skills, experiences, or approaches they value]
- De-emphasize: [Elements they don't prioritize or have criticized]
- Include: [Specific deliverables, processes, or guarantees they appreciate]
- Avoid: [Approaches, language, or promises that have backfired]

**Sample Opening Lines:**
1. "[Personalized opening that addresses their specific challenge]"
2. "[Alternative opening that highlights relevant experience]"
3. "[Results-focused opening with specific metrics]"

**Client Relationship Management Tips:**
- Optimal check-in frequency: [Based on their communication preferences]
- Reporting style they prefer: [Detailed reports/Quick updates/Visual progress/Milestone summaries]
- How to handle revisions: [Their typical revision patterns and preferences]
- Upselling opportunities: [Additional services they commonly request]

**Overall Client Assessment:**
- Client type: [Collaborative Partner/Hands-off Delegator/Detail-oriented Manager/Results-focused Executive]
- Difficulty level: [Easy/Moderate/Challenging/High-maintenance]
- Profit potential: [Budget range and project scope tendencies]
- Long-term relationship potential: [One-off projects/Ongoing work/Retainer potential]
- Recommended freelancer experience level: [Beginner-friendly/Intermediate/Expert-only]

**Success Probability Factors:**
- Highest impact proposal elements: [What will most likely get you hired]
- Deal-breaker avoidance: [Critical mistakes that will eliminate you]
- Competitive advantages to highlight: [What sets you apart from other applicants]

Provide specific, actionable insights based on the actual content of the reviews, not generic advice.`;
  }

  // Advanced proposal optimization
  async optimizeProposal(apiKey, originalProposal, jobRequirements, optimizationType = 'general') {
    try {
      const optimizationPrompts = {
        'general': 'Optimize this proposal for better engagement and higher response rate',
        'budget': 'Optimize this proposal to better address budget concerns and show value',
        'timeline': 'Optimize this proposal to address timeline requirements and show efficiency',
        'quality': 'Optimize this proposal to emphasize quality, expertise, and premium service',
        'competition': 'Optimize this proposal to stand out from competitors and show unique value'
      };

      const prompt = `You are a proposal optimization expert. ${optimizationPrompts[optimizationType]}.

**Original Proposal:**
${originalProposal}

**Job Requirements:**
${jobRequirements}

**Optimization Instructions:**
1. Maintain the core message and personality
2. Improve clarity and impact
3. Strengthen the value proposition
4. Enhance call-to-action
5. Fix any weak points or generic language
6. Ensure perfect grammar and flow

Return only the optimized proposal without explanations:`;

      const llm = new ChatOpenAI({
        apiKey,
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 2000,
      });

      const messages = [
        new SystemMessage('You are an expert proposal optimizer focused on improving win rates.'),
        new HumanMessage(prompt)
      ];

      const response = await llm.invoke(messages);
      return response.content.trim();
    } catch (error) {
      console.error('Proposal optimization error:', error);
      throw error;
    }
  }

  // Generate multiple proposal variations
  async generateProposalVariations(apiKey, formData, count = 3) {
    const variations = [];
    const approaches = ['consultative', 'results-focused', 'partnership-oriented'];

    for (let i = 0; i < Math.min(count, approaches.length); i++) {
      try {
        const modifiedFormData = {
          ...formData,
          proposalApproach: approaches[i]
        };

        const variation = await this.generateProposal(apiKey, modifiedFormData);
        variations.push({
          approach: approaches[i],
          content: variation,
          title: this.getApproachTitle(approaches[i])
        });
      } catch (error) {
        console.error(`Error generating variation ${i + 1}:`, error);
      }
    }

    return variations;
  }

  getApproachTitle(approach) {
    const titles = {
      'consultative': 'Consultative Approach',
      'results-focused': 'Results-Driven Approach',
      'partnership-oriented': 'Partnership-Focused Approach'
    };
    return titles[approach] || approach;
  }

  // Analyze proposal quality and provide feedback
  async analyzeProposalQuality(apiKey, proposal, jobRequirements) {
    try {
      const prompt = `Analyze this Upwork proposal and provide detailed feedback on its quality and effectiveness.

**Proposal to Analyze:**
${proposal}

**Job Requirements:**
${jobRequirements}

**Analysis Framework:**
Rate each area from 1-10 and provide specific feedback:

1. **Opening Hook** (1-10): How well does it grab attention?
2. **Relevance** (1-10): How well does it match job requirements?
3. **Credibility** (1-10): How well does it establish expertise?
4. **Value Proposition** (1-10): How clear is the value offered?
5. **Personalization** (1-10): How personalized is it to this client?
6. **Call to Action** (1-10): How compelling is the next step?
7. **Overall Quality** (1-10): Grammar, flow, professionalism

**Required Output Format:**

**PROPOSAL QUALITY ANALYSIS**

**Detailed Scores:**
- Opening Hook: X/10 (Attention-grabbing, specific reference to job)
- Relevance: X/10 (Matches job requirements and tech stack)
- Credibility: X/10 (Demonstrates expertise and experience)
- Value Proposition: X/10 (Clear benefits and outcomes)
- Personalization: X/10 (Client-specific customization)
- Call to Action: X/10 (Clear next steps and enthusiasm)
- Overall Quality: X/10 (Grammar, flow, professionalism)
- **Total Score: XX/70**

**Performance Rating:**
- 60-70: Excellent (High win probability)
- 50-59: Good (Solid chance)
- 40-49: Average (Needs improvement)
- Below 40: Poor (Significant revision needed)

**Strengths:**
- [List 3-5 specific strong points with examples]

**Critical Areas for Improvement:**
- [List 3-5 specific improvements with actionable steps]

**Specific Recommendations:**
1. [Detailed actionable suggestion with example]
2. [Technical improvement with specific implementation]
3. [Personalization enhancement with client focus]

**Competitive Advantages:**
- [What makes this proposal stand out from typical responses]
- [Unique value propositions identified]

**Risk Factors:**
- [Specific elements that might hurt hiring chances]
- [Generic phrases or weak points to address]

**Win Probability:** X% (Based on: relevance score, personalization level, technical accuracy, and competitive positioning)

**Improvement Priority:**
1. [Most critical improvement needed]
2. [Second priority improvement]
3. [Third priority improvement]`;

      const llm = new ChatOpenAI({
        apiKey,
        model: 'gpt-4',
        temperature: 0.2,
        maxTokens: 1500,
      });

      const messages = [
        new SystemMessage('You are an expert proposal analyst with deep knowledge of what makes Upwork proposals successful.'),
        new HumanMessage(prompt)
      ];

      const response = await llm.invoke(messages);
      return response.content.trim();
    } catch (error) {
      console.error('Proposal analysis error:', error);
      throw error;
    }
  }

  // Extract job insights for better targeting
  extractJobInsights(jobDescription) {
    const insights = {
      urgency: false,
      budgetMentioned: false,
      experienceLevel: 'intermediate',
      projectType: 'unknown',
      clientType: 'unknown',
      keyRequirements: [],
      technologies: [],
      deliverables: []
    };

    const urgencyKeywords = ['urgent', 'asap', 'immediately', 'rush', 'quick', 'fast'];
    const budgetKeywords = ['budget', 'cost', 'price', '$', 'affordable', 'cheap', 'expensive'];
    const experienceKeywords = {
      'beginner': ['beginner', 'entry', 'junior', 'new', 'learning'],
      'intermediate': ['intermediate', 'experienced', 'skilled', 'proficient'],
      'expert': ['expert', 'senior', 'advanced', 'master', 'guru', 'ninja']
    };

    const lowerDesc = jobDescription.toLowerCase();

    // Check urgency
    insights.urgency = urgencyKeywords.some(keyword => lowerDesc.includes(keyword));

    // Check budget mention
    insights.budgetMentioned = budgetKeywords.some(keyword => lowerDesc.includes(keyword));

    // Determine experience level
    for (const [level, keywords] of Object.entries(experienceKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        insights.experienceLevel = level;
        break;
      }
    }

    return insights;
  }

  // Utility method for retry logic
  async withRetry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  // Analyze real Upwork job patterns based on test.txt examples
  analyzeRealUpworkPatterns(jobDescription) {
    const text = jobDescription.toLowerCase();

    // Client type analysis based on real patterns
    let clientType = 'Individual';
    if (text.includes('company') || text.includes('team') || text.includes('organization')) {
      clientType = 'Company';
    }

    // Urgency analysis from real examples
    const urgencyKeywords = ['asap', 'urgent', 'immediately', 'quick', 'fast', 'rush', 'soon'];
    const urgency = urgencyKeywords.some(keyword => text.includes(keyword)) ? 'High' : 'Normal';

    // Budget analysis
    const budgetMentioned = /\$\d+|\d+\s*hrs?\/week|hourly|fixed.price/i.test(jobDescription);

    // Experience level analysis
    let experienceLevel = 'Intermediate';
    if (/expert|senior|advanced|3\+\s*years|5\+\s*years/i.test(text)) {
      experienceLevel = 'Expert';
    } else if (/junior|entry|beginner|new/i.test(text)) {
      experienceLevel = 'Entry';
    }

    // Project type analysis
    let projectType = 'Development';
    if (/design|ui|ux|graphic|logo/i.test(text)) {
      projectType = 'Design';
    } else if (/marketing|seo|social|content/i.test(text)) {
      projectType = 'Marketing';
    } else if (/data|analytics|analysis/i.test(text)) {
      projectType = 'Data';
    }

    // Key requirements extraction
    const keyRequirements = [];

    // Technology requirements
    const techStack = this.extractTechnologies(text);
    if (techStack.length > 0) {
      keyRequirements.push(`- Technology Stack: ${techStack.join(', ')}`);
    }

    // Timeline requirements
    if (/1.2\s*months?|1.3\s*months?|30\s*hrs?\/week/i.test(text)) {
      keyRequirements.push('- Timeline: Short to medium-term project (1-3 months)');
    }

    // Special requirements
    if (/contract.to.hire|full.time/i.test(text)) {
      keyRequirements.push('- Opportunity: Potential for long-term engagement');
    }

    // Client insights based on real patterns
    const clientInsights = this.generateClientInsights(jobDescription, clientType, experienceLevel);

    return {
      clientType,
      urgency,
      budgetMentioned,
      experienceLevel,
      projectType,
      keyRequirements,
      clientInsights,
      summary: `${clientType} client seeking ${experienceLevel} level ${projectType} work with ${urgency.toLowerCase()} priority${budgetMentioned ? ' (budget-conscious)' : ''}`
    };
  }

  generateClientInsights(jobDescription, clientType, experienceLevel) {
    const insights = [];

    if (clientType === 'Company') {
      insights.push('- Professional company client likely values structured communication and detailed progress updates');
    } else {
      insights.push('- Individual client may prefer direct, personal communication and flexible approach');
    }

    if (experienceLevel === 'Expert') {
      insights.push('- Client specifically seeks expert-level skills, emphasize advanced capabilities and complex project experience');
    } else if (experienceLevel === 'Entry') {
      insights.push('- Entry-level opportunity, focus on enthusiasm, learning ability, and competitive pricing');
    }

    if (/node\.?js|javascript|react/i.test(jobDescription)) {
      insights.push('- Technical project requiring modern JavaScript stack expertise');
    }

    if (/restful|api|backend/i.test(jobDescription)) {
      insights.push('- Backend/API development focus, highlight server-side experience and database skills');
    }

    return insights.join('\n');
  }

  // Save proposal for analytics (localStorage)
  saveProposalAnalytics(proposalData) {
    try {
      const analytics = JSON.parse(localStorage.getItem('upwork_proposal_analytics') || '[]');
      const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        profile: proposalData.profile,
        jobType: proposalData.jobRequirements.substring(0, 100),
        proposalLength: proposalData.proposalLength,
        model: proposalData.model,
        keywords: proposalData.keywords.filter(k => k.trim()).length
      };

      analytics.push(entry);

      // Keep only last 100 entries
      if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100);
      }

      localStorage.setItem('upwork_proposal_analytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  // Get proposal analytics
  getProposalAnalytics() {
    try {
      return JSON.parse(localStorage.getItem('upwork_proposal_analytics') || '[]');
    } catch (error) {
      console.error('Error loading analytics:', error);
      return [];
    }
  }

  // Extract technologies from job description
  extractTechnologies(text) {
    const techKeywords = [
      'react', 'vue', 'angular', 'javascript', 'typescript', 'node.js', 'python', 'php', 'java',
      'wordpress', 'shopify', 'magento', 'woocommerce', 'html', 'css', 'sass', 'bootstrap',
      'mysql', 'postgresql', 'mongodb', 'aws', 'azure', 'docker', 'kubernetes', 'express',
      'django', 'flask', 'laravel', 'spring', 'rails', 'flutter', 'react native', 'swift',
      'kotlin', 'c++', 'c#', 'ruby', 'go', 'rust', 'redis', 'elasticsearch', 'graphql',
      'rest api', 'microservices', 'devops', 'ci/cd', 'jenkins', 'git', 'github', 'gitlab'
    ];

    const lowerText = text.toLowerCase();
    return techKeywords.filter(tech => lowerText.includes(tech.toLowerCase()));
  }
}

export default new ProposalService();
