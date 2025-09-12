import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Save, 
  FolderOpen, 
  Trash2, 
  Upload, 
  FileText, 
  Search, 
  Plus, 
  Minus,
  Eye,
  EyeOff,
  Settings,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  Target,
  Zap,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react';
import ProposalTemplates from './ProposalTemplates';
import CustomModal from './CustomModal';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500/90' : type === 'success' ? 'bg-green-500/90' : 'bg-blue-500/90';
  const IconComponent = type === 'error' ? AlertCircle : type === 'success' ? CheckCircle : Info;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComponent className="w-4 h-4" />
          <span>{message}</span>
        </div>
        <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

function ProposalForm({ onGenerate, isGenerating, error }) {
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: 'input', title: '', message: '', placeholder: '', onConfirm: null });
  const [formData, setFormData] = useState({
    profile: '',
    aboutYou: '',
    jobRequirements: '',
    extraInstructions: '',
    experience: '',
    keywords: [''],
    portfolioLinks: [''],
    proposalTone: 'default',
    proposalLength: 'medium',
    model: 'gpt-3.5-turbo',
    highQuality: false,
    showAdditionalFields: true,
    clientName: '',
    projectBudget: '',
    timeline: '',
    specialRequirements: ''
  });

  const [jobInsights, setJobInsights] = useState(null);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [cvFile, setCvFile] = useState(null);

  // Toast notification function
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Load saved profiles on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('upwork_saved_profiles') || '[]');
    setSavedProfiles(saved);
  }, []);

  // Analyze job requirements when they change
  useEffect(() => {
    if (formData.jobRequirements.length > 50) {
      analyzeJobRequirements();
    }
  }, [formData.jobRequirements]);

  const analyzeJobRequirements = () => {
    try {
      const text = formData.jobRequirements.toLowerCase();
      const insights = {
        urgency: /urgent|asap|immediately|rush|quick/i.test(text),
        budgetMentioned: /budget|\$|cost|price|affordable/i.test(text),
        experienceLevel: /expert|senior|advanced/i.test(text) ? 'expert' :
          /beginner|entry|junior/i.test(text) ? 'beginner' : 'intermediate',
        technologies: extractTechnologies(text),
        projectType: determineProjectType(text),
        estimatedComplexity: text.length > 500 ? 'high' : text.length > 200 ? 'medium' : 'low'
      };
      setJobInsights(insights);
    } catch (error) {
      console.error('Error analyzing job requirements:', error);
      showToast('Failed to analyze job requirements', 'error');
    }
  };

  const extractTechnologies = (text) => {
    const techKeywords = [
      'react', 'vue', 'angular', 'javascript', 'typescript', 'node.js', 'python', 'php', 'java',
      'wordpress', 'shopify', 'magento', 'woocommerce', 'html', 'css', 'sass', 'bootstrap',
      'mysql', 'postgresql', 'mongodb', 'aws', 'azure', 'docker', 'kubernetes'
    ];
    return techKeywords.filter(tech => text.includes(tech));
  };

  const determineProjectType = (text) => {
    if (/website|web development|frontend|backend/i.test(text)) return 'Web Development';
    if (/mobile|app|ios|android/i.test(text)) return 'Mobile Development';
    if (/design|ui|ux|graphic|logo/i.test(text)) return 'Design';
    if (/marketing|seo|social media|content/i.test(text)) return 'Marketing';
    if (/data|analytics|machine learning|ai/i.test(text)) return 'Data Science';
    return 'General';
  };

  const showModal = (type, title, message, placeholder, onConfirm) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      placeholder,
      onConfirm
    });
  };

  const saveCurrentProfile = () => {
    showModal(
      'input',
      'Save Profile',
      'Enter a name for this profile:',
      'Profile name...',
      (profileName) => {
        try {
          const newProfile = {
            id: Date.now(),
            name: profileName,
            data: { ...formData }
          };
          const updated = [...savedProfiles, newProfile];
          setSavedProfiles(updated);
          localStorage.setItem('upwork_saved_profiles', JSON.stringify(updated));
          showToast(`Profile "${profileName}" saved successfully!`, 'success');
        } catch (error) {
          console.error('Error saving profile:', error);
          showToast('Failed to save profile', 'error');
        }
      }
    );
  };

  const loadProfile = (profile) => {
    try {
      setFormData({ ...formData, ...profile.data });
      setShowProfileManager(false);
      showToast(`Profile "${profile.name}" loaded successfully!`, 'success');
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast('Failed to load profile', 'error');
    }
  };

  const deleteProfile = (profileId) => {
    try {
      const profileToDelete = savedProfiles.find(p => p.id === profileId);
      const updated = savedProfiles.filter(p => p.id !== profileId);
      setSavedProfiles(updated);
      localStorage.setItem('upwork_saved_profiles', JSON.stringify(updated));
      showToast(`Profile "${profileToDelete?.name || 'Unknown'}" deleted successfully!`, 'success');
    } catch (error) {
      console.error('Error deleting profile:', error);
      showToast('Failed to delete profile', 'error');
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplates(false);

    // Auto-fill some fields based on template
    if (template.category === 'Web Development') {
      setFormData(prev => ({ ...prev, profile: 'fullstack' }));
    } else if (template.category === 'Design') {
      setFormData(prev => ({ ...prev, profile: 'graphic' }));
    } else if (template.category === 'Digital Marketing') {
      setFormData(prev => ({ ...prev, profile: 'digital' }));
    } else if (template.category === 'Content Creation') {
      setFormData(prev => ({ ...prev, profile: 'content' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const extractResumeText = async () => {
    if (!cvFile) {
      showToast('Please select a resume file first', 'error');
      return;
    }

    // Progress tracking
    const button = document.getElementById('extract-resume-btn');
    const originalText = button?.textContent;

    const updateProgress = (message) => {
      if (button) {
        button.textContent = message;
        button.disabled = true;
      }
    };

    try {
      updateProgress('📖 Reading file...');
      const text = await readFileAsText(cvFile);

      updateProgress('🔍 Analyzing content...');
      await new Promise(resolve => setTimeout(resolve, 300)); // Show progress

      // Handle special error cases
      if (text === 'PDF_EXTRACTION_FAILED') {
        showModal(
          'input',
          'PDF Extraction Failed',
          'PDF text extraction failed. Please copy and paste your resume content here:',
          'Paste your resume content here...',
          (manualInput) => {
            if (manualInput && manualInput.length > 50) {
              const manualInfo = analyzeResumeText(manualInput);
              setFormData(prev => ({
                ...prev,
                aboutYou: manualInfo.fullText,
                experience: manualInfo.experience || prev.experience,
                keywords: [...prev.keywords.filter(k => k.trim()), ...manualInfo.skills]
              }));
              showToast('✅ Manual content analyzed and applied successfully!', 'success');
            } else {
              showToast('❌ Resume analysis incomplete. Please fill the "About You" section manually.', 'error');
            }
          }
        );
        return;
      }

      if (text === 'FORMAT_EXTRACTION_FAILED') {
        showModal(
          'input',
          'Format Not Supported',
          'This file format requires manual input. Please copy and paste your resume content here:',
          'Paste your resume content here...',
          (manualInput) => {
            if (manualInput && manualInput.length > 50) {
              const manualInfo = analyzeResumeText(manualInput);
              setFormData(prev => ({
                ...prev,
                aboutYou: manualInfo.fullText,
                experience: manualInfo.experience || prev.experience,
                keywords: [...prev.keywords.filter(k => k.trim()), ...manualInfo.skills]
              }));
              showToast('✅ Manual content analyzed and applied successfully!', 'success');
            } else {
              showToast('❌ Resume analysis incomplete. Please fill the "About You" section manually.', 'error');
            }
          }
        );
        return;
      }

      // Analyze the extracted text
      const extractedInfo = analyzeResumeText(text);

      // Auto-fill the About You section with COMPLETE extracted text
      if (extractedInfo.fullText && extractedInfo.fullText.length > 50) {
        setFormData(prev => ({
          ...prev,
          aboutYou: extractedInfo.fullText, // Use complete extracted text
          experience: extractedInfo.experience || prev.experience,
          keywords: [...prev.keywords.filter(k => k.trim()), ...extractedInfo.skills] // Add ALL found skills
        }));

        updateProgress('✅ Applying results...');
        await new Promise(resolve => setTimeout(resolve, 200));

        showToast(`🎉 Resume Analysis Complete! Extracted ${text.length} characters, found ${extractedInfo.skills.length} skills, and auto-filled your profile successfully!`, 'success');
      } else {
        // If extraction failed, provide manual option
        showModal(
          'input',
          'Manual Resume Input',
          '⚠️ Automatic extraction had limited success.\n\nPlease paste your resume content here for better analysis:',
          'Paste your resume content here...',
          (manualInput) => {
            if (manualInput && manualInput.length > 50) {
              const manualInfo = analyzeResumeText(manualInput);
              setFormData(prev => ({
                ...prev,
                aboutYou: manualInfo.fullText, // Use complete text
                experience: manualInfo.experience || prev.experience,
                keywords: [...prev.keywords.filter(k => k.trim()), ...manualInfo.skills] // Add all skills
              }));
              showToast('✅ Manual content analyzed and applied successfully!', 'success');
            } else {
              showToast('❌ Resume analysis incomplete. Please fill the "About You" section manually.', 'error');
            }
          }
        );
      }
    } catch (error) {
      console.error('Error extracting resume text:', error);

      // Provide manual fallback
      showModal(
        'input',
        'Manual Resume Input',
        '❌ File processing failed.\n\nFor best results, please copy and paste your resume content here:',
        'Paste your resume content here...',
        (manualInput) => {
          if (manualInput && manualInput.length > 50) {
            const manualInfo = analyzeResumeText(manualInput);
            setFormData(prev => ({
              ...prev,
              aboutYou: manualInfo.fullText, // Use complete text
              experience: manualInfo.experience || prev.experience,
              keywords: [...prev.keywords.filter(k => k.trim()), ...manualInfo.skills] // Add all skills
            }));
            showToast('✅ Manual content analyzed and applied successfully!', 'success');
          } else {
            showToast('❌ Resume analysis failed. Please fill the form manually or try a different file format (TXT recommended).', 'error');
          }
        }
      );
    } finally {
      // Reset button state
      if (button) {
        button.textContent = originalText || '🔍 Extract & Analyze Resume';
        button.disabled = false;
      }
    }
  };

  const readFileAsText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      if (file.type === 'application/pdf') {
        // For PDF files, read as ArrayBuffer and try to extract text
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target.result;
            const text = await extractPDFText(arrayBuffer);
            resolve(text);
          } catch (error) {
            console.error('PDF extraction failed:', error);
            // Fallback: ask user to copy-paste content
            // Note: This is inside a Promise, so we can't use modal here
            // We'll resolve with a message and let the calling function handle the modal
            resolve('PDF_EXTRACTION_FAILED');
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'text/plain') {
        // Plain text files
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        // For DOC/DOCX and other formats, try reading as text (limited support)
        reader.onload = (e) => {
          const result = e.target.result;
          if (typeof result === 'string' && result.length > 50) {
            resolve(result);
          } else {
            // Fallback for unsupported formats
            // Note: This is inside a Promise, so we can't use modal here
            // We'll resolve with a message and let the calling function handle the modal
            resolve('FORMAT_EXTRACTION_FAILED');
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      }
    });
  };

  // Simple PDF text extraction (basic implementation)
  // Advanced PDF text extraction using PDF.js (similar to PaddleOCR approach)
  const extractPDFText = async (arrayBuffer) => {
    try {
      // Method 1: Try using PDF.js library (most reliable)
      const text = await extractWithPDFJS(arrayBuffer);
      if (text && text.length > 50) {
        return text;
      }
    } catch (error) {
      console.log('PDF.js method failed, trying fallback methods...');
    }

    try {
      // Method 2: Advanced PDF structure parsing
      const text = await advancedPDFExtraction(arrayBuffer);
      if (text && text.length > 50) {
        return text;
      }
    } catch (error) {
      console.log('Advanced extraction failed, trying basic method...');
    }

    try {
      // Method 3: Basic character extraction (last resort)
      const text = await basicPDFExtraction(arrayBuffer);
      if (text && text.length > 50) {
        return text;
      }
    } catch (error) {
      console.log('All extraction methods failed');
    }

    throw new Error('Unable to extract text from PDF. Please use TXT format or copy-paste content manually.');
  };

  // Method 1: PDF.js library extraction
  const extractWithPDFJS = async (arrayBuffer) => {
    try {
      // Load PDF.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      document.head.appendChild(script);

      return new Promise((resolve, reject) => {
        script.onload = async () => {
          try {
            // Set worker
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            // Load PDF
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            // Extract text from first 3 pages
            for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 3); pageNum++) {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();

              const pageText = textContent.items
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              fullText += pageText + ' ';
            }

            resolve(fullText.trim());
          } catch (error) {
            reject(error);
          }
        };

        script.onerror = () => reject(new Error('Failed to load PDF.js'));
      });
    } catch (error) {
      throw new Error('PDF.js extraction failed: ' + error.message);
    }
  };

  // Method 2: Advanced PDF structure parsing
  const advancedPDFExtraction = async (arrayBuffer) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    let extractedText = '';

    // Look for text streams in PDF
    const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
    let match;

    while ((match = streamRegex.exec(pdfString)) !== null) {
      const streamContent = match[1];

      // Try to decode text from stream
      const textMatches = streamContent.match(/\((.*?)\)/g);
      if (textMatches) {
        textMatches.forEach(textMatch => {
          const text = textMatch.replace(/[()]/g, '').trim();
          if (text.length > 2 && /[a-zA-Z]/.test(text)) {
            extractedText += text + ' ';
          }
        });
      }

      // Also look for Tj and TJ operators
      const tjMatches = streamContent.match(/\((.*?)\)\s*Tj/g);
      if (tjMatches) {
        tjMatches.forEach(tjMatch => {
          const text = tjMatch.replace(/[()]/g, '').replace(/\s*Tj/g, '').trim();
          if (text.length > 1 && /[a-zA-Z]/.test(text)) {
            extractedText += text + ' ';
          }
        });
      }
    }

    // Clean up extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\.\,\;\:\!\?\-\(\)\@\+]/g, ' ')
      .trim();

    return extractedText;
  };

  // Method 3: Basic character extraction (fallback)
  const basicPDFExtraction = async (arrayBuffer) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    let consecutiveReadable = 0;

    for (let i = 0; i < uint8Array.length - 1; i++) {
      const char = String.fromCharCode(uint8Array[i]);

      // Check for readable characters
      if (char.match(/[a-zA-Z0-9\s\.\,\;\:\!\?\-\(\)\@]/)) {
        text += char;
        consecutiveReadable++;

        // Add space after sequences of readable characters
        if (consecutiveReadable > 20 && char === ' ') {
          text += ' ';
        }
      } else {
        consecutiveReadable = 0;
        // Add space between different sections
        if (text.length > 0 && !text.endsWith(' ')) {
          text += ' ';
        }
      }
    }

    // Clean up the extracted text
    text = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\.\,\;\:\!\?\-\(\)\@\+]/g, ' ')
      .trim();

    return text;
  };

  const analyzeResumeText = (text) => {
    if (!text || text.length < 50) {
      return {
        fullText: 'Unable to extract meaningful content from resume. Please fill manually.',
        experience: '',
        skills: []
      };
    }

    // Clean and normalize the text while preserving structure
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\.\,\;\:\!\?\-\(\)\@\+\/\\]/g, ' ')
      .trim();

    // Return the COMPLETE extracted text for "About You" section
    const fullText = cleanText;

    // Enhanced skill extraction with comprehensive keywords
    const skillKeywords = [
      // Programming Languages
      'JavaScript', 'TypeScript', 'Python', 'Java', 'PHP', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
      // Frontend Frameworks & Libraries
      'React', 'Vue.js', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'jQuery',
      // Frontend Technologies
      'HTML', 'HTML5', 'CSS', 'CSS3', 'SASS', 'SCSS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Tailwind', 'Material-UI', 'Chakra UI',
      // Backend Frameworks
      'Node.js', 'Express.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Spring', 'Laravel', 'CodeIgniter', 'ASP.NET', 'Rails',
      // Databases
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Oracle', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase',
      // Cloud & DevOps
      'AWS', 'Amazon Web Services', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible',
      // Mobile Development
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Android', 'iOS', 'Swift', 'Kotlin',
      // Tools & Platforms
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Trello', 'Asana',
      // Design Tools
      'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InDesign', 'Canva',
      // Testing
      'Jest', 'Cypress', 'Selenium', 'Mocha', 'Chai', 'Puppeteer', 'Playwright',
      // API & Architecture
      'REST API', 'RESTful', 'GraphQL', 'Microservices', 'API Gateway', 'WebSocket', 'gRPC',
      // Methodologies
      'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'DevOps', 'Waterfall',
      // CMS & E-commerce
      'WordPress', 'Drupal', 'Shopify', 'WooCommerce', 'Magento', 'Strapi', 'Contentful',
      // Other Technologies
      'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier', 'npm', 'yarn', 'pnpm', 'Composer'
    ];

    // Find all skills mentioned in the text (case-insensitive)
    const foundSkills = [];
    skillKeywords.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(cleanText)) {
        // Avoid duplicates
        if (!foundSkills.some(existing => existing.toLowerCase() === skill.toLowerCase())) {
          foundSkills.push(skill);
        }
      }
    });

    // Also extract custom skills that might not be in our list
    const customSkillPatterns = [
      // Skills mentioned with "experience in", "skilled in", etc.
      /(?:experience in|skilled in|proficient in|expert in|knowledge of|familiar with)\s+([A-Za-z0-9\s\.,]+?)(?:\.|,|and|&)/gi,
      // Skills in bullet points or lists
      /[•\-\*]\s*([A-Za-z0-9\s\.,]+?)(?:\n|$)/gi,
      // Technologies section
      /(?:technologies|skills|tools):\s*([A-Za-z0-9\s\.,\/]+?)(?:\n|$)/gi
    ];

    customSkillPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(cleanText)) !== null) {
        const skillsText = match[1].trim();
        // Split by common separators and clean up
        const skills = skillsText.split(/[,\/&]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 30);
        skills.forEach(skill => {
          if (!foundSkills.some(existing => existing.toLowerCase() === skill.toLowerCase())) {
            foundSkills.push(skill);
          }
        });
      }
    });

    // Enhanced experience extraction
    const experiencePatterns = [
      /(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i,
      /(\d+)\+?\s*yrs?\s*(of\s*)?(experience|exp)/i,
      /experience\s*:\s*(\d+)\+?\s*years?/i,
      /(\d+)\+?\s*years?\s*in/i,
      /(\d+)\+?\s*years?\s*(working|developing|programming)/i,
      /over\s*(\d+)\s*years?/i,
      /more than\s*(\d+)\s*years?/i
    ];

    let experience = '';
    for (const pattern of experiencePatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        experience = match[1];
        break;
      }
    }

    return {
      fullText: fullText, // Complete extracted text for "About You"
      experience: experience || '',
      skills: foundSkills // All found skills for keywords section
    };
  };

  const profiles = [
    { value: 'fullstack', label: 'Full Stack Developer' },
    { value: 'graphic', label: 'Graphic Designer' },
    { value: 'digital', label: 'Digital Marketer' },
    { value: 'content', label: 'Content Creator' },
    { value: 'others', label: 'Others' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'default', label: 'Default' }
  ];

  const lengths = [
    { value: 'detailed', label: 'Detailed' },
    { value: 'medium', label: 'Medium' },
    { value: 'short', label: 'Short' }
  ];

  const models = [
    { value: 'gpt-5', label: 'GPT-5 (Best for Professional Writing)' },
    { value: 'gpt-5-mini', label: 'GPT-5 Mini (Fast, Cost-Efficient, Still High Quality)' },
    { value: 'gpt-4o', label: 'GPT-4o (Fast, High-Quality, Reasoning)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Super Fast, Best Budget Option)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Balanced, Efficient)' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fast, Budget)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.profile || !formData.aboutYou || !formData.jobRequirements) {
        showToast('Please fill in all required fields: Profile, About You, and Job Requirements', 'error');
        return;
      }

      // Filter out empty array items
      const cleanData = {
        ...formData,
        keywords: formData.keywords.filter(k => k.trim()),
        portfolioLinks: formData.portfolioLinks.filter(p => p.trim())
      };

      showToast('Generating your proposal...', 'info');
      onGenerate(cleanData);
    } catch (error) {
      console.error('Error generating proposal:', error);
      showToast('Failed to generate proposal. Please try again.', 'error');
    }
  };

  const handleReset = () => {
    setFormData({
      profile: '',
      aboutYou: '',
      jobRequirements: '',
      extraInstructions: '',
      experience: '',
      keywords: [''],
      portfolioLinks: [''],
      proposalTone: 'default',
      proposalLength: 'medium',
      model: 'gpt-3.5-turbo',
      highQuality: false,
      showAdditionalFields: true,
      clientName: '',
      projectBudget: '',
      timeline: '',
      specialRequirements: ''
    });
    setCvFile(null);
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="glass-card neon p-6">
        {/* Mobile-Responsive Header */}
        <div className="mb-6">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-0">Generate a Personalized Proposal</h2>
          
          {/* Buttons - Mobile Stack, Desktop Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            {/* <button
              type="button"
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-200 hover:bg-purple-600/30 text-sm"
            >
              📋 Templates
            </button> */}
            <button
              type="button"
              onClick={() => setShowProfileManager(!showProfileManager)}
              className="px-3 sm:px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-200 hover:bg-blue-600/30 text-xs sm:text-sm flex items-center justify-center"
            >
              <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Profiles ({savedProfiles.length})</span>
              <span className="sm:hidden">Profiles ({savedProfiles.length})</span>
            </button>
            <button
              type="button"
              onClick={saveCurrentProfile}
              className="px-3 sm:px-4 py-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-200 hover:bg-green-600/30 text-xs sm:text-sm flex items-center justify-center"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Save Profile</span>
              <span className="sm:hidden">Save Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Manager */}
        {showProfileManager && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-white font-medium mb-3">Saved Profiles</h3>
            {savedProfiles.length === 0 ? (
              <p className="text-white/50 text-sm">No saved profiles yet. Fill out the form and click "Save Profile" to create one.</p>
            ) : (
              <div className="space-y-2">
                {savedProfiles.map(profile => (
                  <div key={profile.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                    <div>
                      <div className="text-white font-medium">{profile.name}</div>
                      <div className="text-white/50 text-sm">{profile.data.profile} • {profile.data.experience} years</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadProfile(profile)}
                        className="px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded text-blue-200 hover:bg-blue-600/30 text-sm flex items-center"
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        Load
                      </button>
                      <button
                        onClick={() => deleteProfile(profile.id)}
                        className="px-3 py-1 bg-red-600/20 border border-red-500/50 rounded text-red-200 hover:bg-red-600/30 text-sm flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Template */}
        {selectedTemplate && (
          <div className="mb-6 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-purple-200 font-medium flex items-center gap-2">
                <span>📋</span> Using Template: {selectedTemplate.title}
              </h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-purple-300 hover:text-purple-100 text-sm flex items-center"
              >
                <X className="w-3 h-3 mr-1" />
                Remove
              </button>
            </div>
            <div className="text-purple-200/70 text-sm">
              {selectedTemplate.description} • Estimated Win Rate: {selectedTemplate.estimatedWinRate}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedTemplate.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-purple-200 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Insights */}
        {jobInsights && (
          <div className="mb-6 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
            <h3 className="text-purple-200 font-medium mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Job Analysis Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${jobInsights.urgency ? 'bg-red-400' : 'bg-green-400'}`}></span>
                  <span className="text-white/70">Urgency: {jobInsights.urgency ? 'High' : 'Normal'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${jobInsights.budgetMentioned ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
                  <span className="text-white/70">Budget: {jobInsights.budgetMentioned ? 'Mentioned' : 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="text-white/70">Level: {jobInsights.experienceLevel}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-white/70">Type: {jobInsights.projectType}</div>
                <div className="text-white/70">Complexity: {jobInsights.estimatedComplexity}</div>
                {jobInsights.technologies.length > 0 && (
                  <div className="text-white/70">
                    Tech: {jobInsights.technologies.slice(0, 3).join(', ')}
                    {jobInsights.technologies.length > 3 && '...'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Selection */}
          <div>
            <label className="block text-white font-medium mb-2">
              Select Profile *
            </label>
            <select
              value={formData.profile}
              onChange={(e) => handleInputChange('profile', e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" className="bg-gray-800 text-white">Choose your profile...</option>
              {profiles.map(profile => (
                <option key={profile.value} value={profile.value} className="bg-gray-800 text-white">
                  {profile.label}
                </option>
              ))}
            </select>
          </div>

          {/* AI Model Selection - Always Visible */}
          <div>
            <label className="block text-white font-medium mb-2 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              AI Model Selection
            </label>
            <select
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {models.map(model => (
                <option key={model.value} value={model.value} className="bg-gray-800 text-white">
                  {model.label}
                </option>
              ))}
            </select>
            <div className="mt-2 text-white/50 text-sm">
              💡 GPT-4: Best quality & accuracy | GPT-3.5 Turbo: Fastest generation | GPT-4 Turbo: Balanced performance
            </div>
          </div>

          {/* CV Upload Section with Text Extraction */}
          <div>
            <label className="block text-white font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Resume/CV Upload (Auto-fill "About You" section)
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-white/40 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer block text-center">
                <div className="text-white/70 mb-2 flex items-center justify-center">
                  {cvFile ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      File Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume/CV
                    </>
                  )}
                </div>
                <div className="text-white/50 text-sm mb-2">
                  {cvFile ? cvFile.name : 'Best: TXT files | Limited: PDF, DOC, DOCX'}
                </div>
                {cvFile && (
                  <div className="text-green-400 text-sm">
                    Click "Extract & Analyze" to auto-fill your profile information
                  </div>
                )}
                {!cvFile && (
                  <div className="text-yellow-400 text-xs mt-2">
                    💡 For best results, save your resume as a .txt file or be ready to copy-paste content
                  </div>
                )}
              </label>
            </div>
            {cvFile && (
              <div className="mt-3 flex space-x-2">
                <button
                  type="button"
                  id="extract-resume-btn"
                  onClick={extractResumeText}
                  className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-200 hover:bg-blue-600/30 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Extract & Analyze Resume
                </button>
                <button
                  type="button"
                  onClick={() => setCvFile(null)}
                  className="px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-200 hover:bg-red-600/30 text-sm flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove File
                </button>
              </div>
            )}
            <div className="mt-3 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-200 font-medium mb-2 text-sm flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                Resume Analysis Features:
              </h4>
              <ul className="text-blue-200/70 text-xs space-y-1">
                <li>• Automatically extracts your professional summary</li>
                <li>• Identifies years of experience</li>
                <li>• Detects technical skills and keywords</li>
                <li>• Fills "About You" section intelligently</li>
                <li>• Works best with plain text (.txt) files</li>
              </ul>
            </div>
          </div>

          {/* About You Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white font-medium flex items-center">
                <User className="w-4 h-4 mr-2" />
                About You: A description of your background, skills and experience *
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-white/70 text-sm">Additional Fields</span>
                <button
                  type="button"
                  onClick={() => handleInputChange('showAdditionalFields', !formData.showAdditionalFields)}
                  className={`w-12 h-6 rounded-full transition-colors ${formData.showAdditionalFields ? 'bg-purple-600' : 'bg-white/20'
                    }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.showAdditionalFields ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                </button>
              </div>
            </div>
            <textarea
              value={formData.aboutYou}
              onChange={(e) => handleInputChange('aboutYou', e.target.value)}
              placeholder="Describe your background, skills, and experience... OR upload your resume below to auto-fill this section."
              className="w-full h-40 p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
              required
            />
          </div>

          {/* Additional Fields */}
          {formData.showAdditionalFields && (
            <div className="space-y-4 p-4 bg-white/5 rounded-lg">
              <div>
                <label className="block text-white font-medium mb-2 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-white font-medium mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Keywords: Highlight Your Skills and Experience
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search keywords..."
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault();
                        addArrayField('keywords');
                        handleArrayFieldChange('keywords', formData.keywords.length, e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
                    <Search className="w-4 h-4" />
                  </div>
                </div>

                {/* Keyword Suggestions */}
                <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-white/70 text-sm mb-2">General Keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Docker', 'Git', 'REST API', 'GraphQL', 'TypeScript', 'Vue.js', 'Angular', 'PHP', 'MySQL', 'PostgreSQL', 'Redis', 'Kubernetes'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          if (!formData.keywords.includes(suggestion)) {
                            addArrayField('keywords');
                            handleArrayFieldChange('keywords', formData.keywords.length, suggestion);
                          }
                        }}
                        className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-200 hover:bg-purple-600/30 text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Keywords */}
                {formData.keywords.filter(k => k.trim()).length > 0 && (
                  <div className="mt-3">
                    <div className="text-white/70 text-sm mb-2">Selected Keywords:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.filter(k => k.trim()).map((keyword, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-200">
                          <span className="text-sm">{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayField('keywords', index)}
                            className="ml-1 text-purple-300 hover:text-red-300 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Portfolio Links */}
              <div>
                <label className="block text-white font-medium mb-2 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Portfolio Links
                </label>
                {formData.portfolioLinks.map((link, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handleArrayFieldChange('portfolioLinks', index, e.target.value)}
                      placeholder="https://your-portfolio.com"
                      className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {formData.portfolioLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('portfolioLinks', index)}
                        className="px-3 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 hover:bg-red-500/30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('portfolioLinks')}
                  className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-200 hover:bg-purple-600/30 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Portfolio Link
                </button>
              </div>



              {/* Proposal Tone */}
              <div>
                <label className="block text-white font-medium mb-2 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Proposal Tone
                </label>
                <select
                  value={formData.proposalTone}
                  onChange={(e) => handleInputChange('proposalTone', e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {tones.map(tone => (
                    <option key={tone.value} value={tone.value} className="bg-gray-800 text-white">
                      {tone.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proposal Length */}
              <div>
                <label className="block text-white font-medium mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Proposal Length
                </label>
                <select
                  value={formData.proposalLength}
                  onChange={(e) => handleInputChange('proposalLength', e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {lengths.map(length => (
                    <option key={length.value} value={length.value} className="bg-gray-800 text-white">
                      {length.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Additional Project Details */}
          {formData.showAdditionalFields && (
            <div className="space-y-4 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-medium flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Project Details (Optional but Recommended)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Client/Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="e.g., TechCorp, John Smith"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Project Budget Range
                  </label>
                  <select
                    value={formData.projectBudget}
                    onChange={(e) => handleInputChange('projectBudget', e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-gray-800">Select budget range...</option>
                    <option value="under-500" className="bg-gray-800">Under $500</option>
                    <option value="500-1500" className="bg-gray-800">$500 - $1,500</option>
                    <option value="1500-5000" className="bg-gray-800">$1,500 - $5,000</option>
                    <option value="5000-plus" className="bg-gray-800">$5,000+</option>
                    <option value="hourly" className="bg-gray-800">Hourly Rate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Project Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-gray-800">Select timeline...</option>
                    <option value="asap" className="bg-gray-800">ASAP (Rush Job)</option>
                    <option value="1-week" className="bg-gray-800">Within 1 Week</option>
                    <option value="2-4-weeks" className="bg-gray-800">2-4 Weeks</option>
                    <option value="1-3-months" className="bg-gray-800">1-3 Months</option>
                    <option value="ongoing" className="bg-gray-800">Ongoing Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Special Requirements
                  </label>
                  <input
                    type="text"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="e.g., NDA required, specific timezone"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Job Requirements */}
          <div>
            <label className="block text-white font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Job Requirements: Copy and paste the requirements of the job you're applying for *
            </label>
            <textarea
              value={formData.jobRequirements}
              onChange={(e) => handleInputChange('jobRequirements', e.target.value)}
              placeholder="Paste the complete job posting here... The more details you provide, the better the AI can tailor your proposal."
              className="w-full h-48 p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y overflow-y-auto"
              style={{ minHeight: '192px', maxHeight: '400px' }}
              required
            />
            <div className="mt-2 text-white/50 text-sm">
              💡 Tip: Include the full job posting for best results. The AI will analyze client preferences and requirements.
            </div>
          </div>

          {/* Extra Instructions */}
          <div>
            <label className="block text-white font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Extra Instructions (Optional)
            </label>
            <textarea
              value={formData.extraInstructions}
              onChange={(e) => handleInputChange('extraInstructions', e.target.value)}
              placeholder="Add any specific instructions, requirements, or customizations you want the AI to consider when generating your proposal..."
              className="w-full h-32 p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y overflow-y-auto"
              style={{ minHeight: '128px', maxHeight: '300px' }}
            />
            <div className="mt-2 text-white/50 text-sm">
              💡 Examples: "Mention my availability for video calls", "Emphasize quick turnaround time", "Include specific pricing structure", etc.
            </div>
          </div>

          {/* High Quality Generation Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium">High Quality Generation</span>
              <span className="text-white/50 text-sm">?</span>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('highQuality', !formData.highQuality)}
              className={`w-12 h-6 rounded-full transition-colors ${formData.highQuality ? 'bg-purple-600' : 'bg-white/20'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.highQuality ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-white/70 hover:text-white transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Proposal'}
            </button>
          </div>

          {/* Credits Display
        <div className="text-center text-white/50 text-sm">
          19 more credits left
        </div> */}
        </form>

        {/* Templates Modal */}
        {/* {showTemplates && (
          <ProposalTemplates
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )} */}

        {/* Custom Modal - Rendered at root level */}
        {modal.isOpen && (
          <CustomModal
            isOpen={modal.isOpen}
            onClose={() => setModal({ ...modal, isOpen: false })}
            onConfirm={modal.onConfirm}
            title={modal.title}
            message={modal.message}
            placeholder={modal.placeholder}
            type={modal.type}
          />
        )}
      </div>
    </>
  );
}

export default ProposalForm;
