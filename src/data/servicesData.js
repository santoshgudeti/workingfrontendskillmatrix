import {
  FiFileText, FiUsers, FiBarChart2, FiVideo, FiAward, FiShield,
  FiBriefcase, FiCalendar, FiUpload
} from 'react-icons/fi';

/**
 * Centralized services data to avoid duplication
 * Used in ServicesPage (overview) and ServiceDetailPage (details)
 */
export const servicesData = [
  {
    id: 'jd-resume-upload',
    icon: FiFileText,
    title: "JD & Resume Upload",
    shortDescription: "AI-powered job description validation with automated section detection. Bulk resume processing with intelligent parsing and instant match scoring against job requirements.",
    videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQAizMP_NGOxSa7MRnZUA7WoAVkH8f-MxjphfKGw8Anhg2Y",
    videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=22fcf3c0-61d3-4a49-aec4-4676544fb580&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
    features: ['JD Validation Engine', 'Bulk Upload (30+ resumes)', 'AI Parsing - 98% Accuracy', 'Instant Match Scoring'],
    color: 'blue'
  },
  {
    id: 'sending-assessment',
    icon: FiUpload,
    title: "Sending Assessment",
    shortDescription: "Streamlined assessment distribution with automated email workflows. Schedule and send customized tests to multiple candidates with one click and track delivery status in real-time.",
    videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQCYvcrMzWJRR5PS8W8WiAHbAWYZ8QgphVwSDMQhLbAxLOk",
    videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=98bdd2b1-62cd-4142-9347-d2f16f02a81b&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
    features: ['Bulk Email Distribution', 'Custom Test Scheduling', 'Delivery Tracking', 'Automated Reminders'],
    color: 'green'
  },
  {
    id: 'candidate-assessment',
    icon: FiAward,
    title: "Candidate Assessment",
    shortDescription: "Multi-format assessments supporting MCQ, text, voice, and video responses. AI-powered evaluation with comprehensive reports generated within 5 minutes of completion.",
    videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQDcmvv6yeAJRZN2_vP0Vd2yATll98pYXezPOZQ0gdwglX4",
    videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=fab9dcfb-e0c9-4145-937e-f3f4f5d5dd32&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
    features: ['MCQ + Voice + Video + text', 'AI Auto-Scoring', '5-Min Reports', 'Proctoring & Security'],
    color: 'purple'
  },
{
  id: 'assessment-reports',
  icon: FiBarChart2,
  title: "Assessment Report Analyzer",
  shortDescription: "Generate detailed AI-powered assessment reports with question-wise analysis, multi-format scoring, and downloadable PDFs for informed hiring decisions.",
  videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQBlG8I3x93jTKjPG97jzH7KAZmm-3FQI9mXOI6pyftJX2w",
  videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=37c21b65-dfc7-4cde-a8c8-cfde3cccfe7e&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
  features: [
    "Question-wise Evaluation",
    "MCQ, Text, Voice & Video Scoring",
    "AI-Generated Summary Report",
    "Auto Email Delivery (HR & Candidate)",
    "Downloadable PDF Reports"
  ],
  color: "orange"
},
{
  id: 'interview-scheduling',
  icon: FiCalendar,
  title: "Interview Hub - Scheduling",
  shortDescription: "Schedule interviews seamlessly with Google Calendar, Microsoft Teams, and Zoom. Auto-generate meeting links and send calendar invites directly to candidates and interviewers.",
  videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQBmHH_QoCBgTJZk67-XWFF9AUMlHs7qZDC5wiKh-jKO26c",
  videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=667f1c66-20a0-4060-9964-ebff5815fd7f&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
  features: [
    'Google / Teams / Zoom Scheduling',
    'Auto-Generated Meeting Links',
    'Calendar Invite Delivery',
    'Interview Timeline Tracking'
  ],
  color: 'pink'
},

{
  id: 'candidate-upload',
  icon: FiUsers,
  title: "Candidate Upload",
  shortDescription: "Secure document collection and verification workflow where candidates upload PAN, Aadhaar, certificates, and experience letters through a public form.",
  videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQBTg6-PbMBYQq2ZR0JbshQtAQrXrtCRJu15PWAfrQ7sW-w",
  videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=6b387ed0-46bf-4afd-87b0-b6ea25c6cbf8&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D",
  features: [
    "Candidate Document Upload Portal",
    "PAN / Aadhaar / Certificate Submission",
    "HR Approval & Verification Workflow",
    "Secure Public Form Access"
  ],
  color: 'cyan'
},


 {
  id: 'document-verification',
  icon: FiShield,
  title: "Request Documents Workflow",
  shortDescription: "Collect and verify candidate documents through a secure upload portal. HR can review, approve, or reject PAN, Aadhaar, certificates, and experience letters with a structured verification flow.",
  videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQBTg6-PbMBYQq2ZR0JbshQtAQrXrtCRJu15PWAfrQ7sW-w",
  videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=536f83a9-60c6-4258-ad99-474925b25042&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
  features: [
    "Secure Candidate Document Upload",
    "PAN / Aadhaar / Certificate Submission",
    "HR Review & Approval Workflow",
    "Centralized Document Tracking"
  ],
  color: 'teal'
},
{
  id: 'offer-letter-automation',
  icon: FiAward,
  title: "Offer Letter Automation",
  shortDescription: "Generate offer letters instantly using branded templates with auto-filled candidate details. Edit, review, export as PDF, and send directly to candidates in one seamless workflow.",
  videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQBusZ2n8smWSYo9gvQnRS5NATUKsjymTU-zl305Q07yTCQ",
  videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=6e91b06f-c9a7-4949-8a3f-4e5c734f7b4e&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D",
  features: [
    "Branded Template Support",
    "Auto-Filled Candidate Details",
    "Editable Offer Preview",
    "Instant PDF Generation & Delivery"
  ],
  color: 'indigo'
},

{
  id: 'job-posting-portal',
  icon: FiBriefcase,
  title: "Job Marketing & Posting Portal",
  shortDescription: "Create and publish job postings with a unique public URL that candidates can access to apply directly. Share jobs across platforms and receive all applications instantly in your HR dashboard.",
  videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQC7WDCuOAfWRp7lXkCfCPZqARr4ZfsA97pG3E-tFlL96Mk",
  videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=2b58305b-07c0-46f9-9eae-655e09f608f6&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D",
  features: [
    "Public Job Posting URL",
    "Share Across LinkedIn / Naukri / Platforms",
    "Candidate Apply Form",
    "Instant Resume Collection"
  ],
  color: 'rose'
},

  {
  id: 'applicant-intake',
  icon: FiUsers,
  title: "Applicant Intake Dashboard",
  shortDescription: "View and manage all applications submitted through public job postings. Access candidate details, download resumes, and move applicants directly into your ATS workflow.",
  videoUrl: "https://cognitbotz-my.sharepoint.com/:v:/p/santosh_g/IQBU0pwNEgIvTZYlk5lKygZBAT9GYtBBl7wLE-qmwU1o0B8",
  videoEmbedUrl: "https://cognitbotz-my.sharepoint.com/personal/santosh_g/_layouts/15/embed.aspx?UniqueId=1dd29c54-02d0-2f12-4d96-2593994a4a06&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D",
  features: [
    "View Public Job Applications",
    "Candidate Detail Access",
    "Resume Downloading",
    "Move to ATS Matching"
  ],
  color: 'amber'
},

];

// Helper function to get service by ID
export const getServiceById = (id) => {
  return servicesData.find(service => service.id === id);
};

// Helper function to get all service IDs
export const getAllServiceIds = () => {
  return servicesData.map(service => service.id);
};
