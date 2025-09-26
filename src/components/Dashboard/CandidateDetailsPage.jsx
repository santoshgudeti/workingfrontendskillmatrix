import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faFileAlt, 
  faChartBar, 
  faCalendarAlt, 
  faDownload, 
  faEye,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faMicrophone,
  faVideo,
  faGraduationCap,
  faBuilding,
  faIdBadge,
  faBriefcase,
  faStar,
  faHandshake,
  faUserTimes,
  faEdit,
  faComments,
  faThumbsUp,
  faThumbsDown,
  faExclamationTriangle,
  faVideo as faVideoIcon,
  faFileContract,
  faEnvelopeOpen,
  faExternalLinkAlt,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faMicrosoft as faMicrosoftBrand} from '@fortawesome/free-brands-svg-icons';
import { toast } from 'react-toastify';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../axiosUtils';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/Dialog';
import AdvancedOfferEditor from './AdvancedOfferEditor';

const CandidateDetailsPage = () => {
  const { candidateId, assessmentSessionId } = useParams();
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSchedulingDropdown, setShowSchedulingDropdown] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState('not-scheduled'); // not-scheduled, scheduled, completed
  const [interviewFeedback, setInterviewFeedback] = useState({
    rating: 0,
    feedback: '',
    strengths: '',
    areasForImprovement: '',
    recommendation: 'pending' // pending, proceed, reject
  });

  // Compose placeholders into the current draft HTML
  const composeOfferHtml = (baseHtml) => {
    let html = baseHtml || offerHtml || '';
    const candidateFullBlock = [
      candidateData?.name || candidateData?.email || 'Candidate',
      candidateData?.employeeId ? `Employee Id: ${candidateData.employeeId}` : '',
      candidateData?.address ? `Address: ${candidateData.address}` : '',
    ]
      .filter(Boolean)
      .join('<br/>');

    const interviewDate = assessmentData?.createdAt
      ? new Date(assessmentData.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString();

    const benefitsList = (offerData.benefits || '')
      .split('\n')
      .filter(Boolean)
      .map((b) => `<li>${b}</li>`) 
      .join('');

    // Simple INR words fallback
    const numToWordsIndian = (numStr) => {
      const n = Number(String(numStr).replace(/[^0-9.]/g, '')) || 0;
      if (!n) return 'Zero Rupees';
      try {
        const intl = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
        return `${intl.format(n)} Rupees`;
      } catch { return `${n} Rupees`; }
    };

  // Ensure an Interview exists server-side before opening feedback modal
  const ensureInterviewForSession = async () => {
    try {
      await axiosInstance.post('/api/interviews/ensure-by-session', {
        assessmentSessionId,
        candidateId,
      });
    } catch (e) {
      console.error('Failed to ensure interview:', e);
      toast.error('Unable to prepare interview record for feedback.');
      throw e;
    }
  };

    // Sample salary split if HR didn’t provide granular inputs
    // Use structured editor rows when present; otherwise estimate
    const gross = Number(String(offerData.salary || '').replace(/[^0-9.]/g, '')) || 0;
    const monthly = Math.round(gross / 12);
    const ePairs = (earnings && earnings.length && earnings.some(r=>r.amount))
      ? earnings.map(r => [r.name || '', Number(String(r.amount).replace(/[^0-9.]/g, '')) || 0])
      : [
          ['Basic Wage', Math.round(monthly * 0.5)],
          ['HRA', Math.round(monthly * 0.2)],
          ['Conveyance Allowance', 1600],
          ['Medical Allowances', 1250],
          ['Other Allowances', Math.max(0, monthly - Math.round(monthly * 0.5) - Math.round(monthly * 0.2) - 1600 - 1250)],
        ];
    const dPairs = (deductions && deductions.length && deductions.some(r=>r.amount))
      ? deductions.map(r => [r.name || '', Number(String(r.amount).replace(/[^0-9.]/g, '')) || 0])
      : [
          ['PF', Math.round(monthly * 0.06)],
          ['ESI/Health Insurance', 150],
          ['Professional Tax', 200],
          ['Loan Recovery', 0],
          ['EPF', Math.round(monthly * 0.06)],
        ];
    const totalEarnings = ePairs.reduce((s, [, v]) => s + v, 0);
    const totalDeductions = dPairs.reduce((s, [, v]) => s + v, 0);
    const netSalary = totalEarnings - totalDeductions;
    const earningsRows = ePairs.map(([k, v]) => `<tr><td>${k}</td><td>₹${v.toLocaleString('en-IN')}</td></tr>`).join('');
    const deductionsRows = dPairs.map(([k, v]) => `<tr><td>${k}</td><td>₹${v.toLocaleString('en-IN')}</td></tr>`).join('');

    // Terms list for templates that use {{termsBlock}}
    const termsList = [
      'You will not publish or make public any material related to the company’s products or projects without written permission.',
      'Maintain utmost secrecy of project documents, commercial offers, design docs, estimates, and intellectual property.',
      'Comply with all rules and regulations issued by the company.',
      'Do not disclose confidential information during or after employment.',
      'Your current place of posting is as per HR communication; disciplinary actions may be taken for violations.',
      'Employee agrees to a bond of not leaving the company for a minimum period of one year from the date of joining.',
      'Non-compete: You agree not to compete with the company during employment and for one year following termination.',
      'Do not accept any present, commission, or gratification from clients or vendors.',
    ];
    const termsBlock = `<ol style="margin:8px 0 0 18px;">${termsList.map(t=>`<li style='margin-bottom:6px; line-height:1.5;'>${t}</li>`).join('')}</ol>`;

    // Salary matrix for 4-column layout templates
    const maxRows = Math.max(ePairs.length, dPairs.length);
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      const e = ePairs[i] || ['', 0];
      const d = dPairs[i] || ['', 0];
      rows.push(`<tr><td>${e[0]}</td><td>₹${(e[1]||0).toLocaleString('en-IN')}</td><td>${d[0]}</td><td>₹${(d[1]||0).toLocaleString('en-IN')}</td></tr>`);
    }
    rows.push(`<tr><td><strong>Total Earnings</strong></td><td><strong>₹${totalEarnings.toLocaleString('en-IN')}</strong></td><td><strong>Total Deductions</strong></td><td><strong>₹${totalDeductions.toLocaleString('en-IN')}</strong></td></tr>`);
    const salaryMatrix = rows.join('');

    html = html
      .replaceAll('{{candidateFullBlock}}', candidateFullBlock)
      .replaceAll('{{interviewDate}}', interviewDate)
      .replaceAll('{{startDate}}', offerData.startDate ? new Date(offerData.startDate).toLocaleDateString() : 'To be determined')
      .replaceAll('{{salary}}', offerData.salary || 'To be discussed')
      .replaceAll('{{benefitsList}}', benefitsList || '<li>As per company policy</li>')
      .replaceAll('{{notes}}', offerData.notes || '')
      .replaceAll('{{earningsRows}}', earningsRows)
      .replaceAll('{{deductionsRows}}', deductionsRows)
      .replaceAll('{{totalEarnings}}', `₹${totalEarnings.toLocaleString('en-IN')}`)
      .replaceAll('{{totalDeductions}}', `₹${totalDeductions.toLocaleString('en-IN')}`)
      .replaceAll('{{netSalary}}', `₹${netSalary.toLocaleString('en-IN')}`)
      .replaceAll('{{annualTakeHome}}', `₹${(netSalary * 12).toLocaleString('en-IN')}`)
      .replaceAll('{{salaryInWords}}', numToWordsIndian(offerData.salary))
      .replaceAll('{{termsBlock}}', termsBlock)
      .replaceAll('{{salaryMatrix}}', salaryMatrix);

    return html;
  };
  const [offerData, setOfferData] = useState({
    position: '',
    salary: '',
    startDate: '',
    benefits: '',
    notes: ''
  });
  const [offerHtml, setOfferHtml] = useState('');
  const [offerPreviewTab, setOfferPreviewTab] = useState('form'); // form | preview
  const [offerTemplate, setOfferTemplate] = useState('branded'); // branded | appointment | simple
  const [splitPreview, setSplitPreview] = useState(false); // live split preview beside editor
  const [inlinePreviewEdit, setInlinePreviewEdit] = useState(false); // enable editing inside preview A4
  const [earnings, setEarnings] = useState([
    { name: 'Basic Wage', amount: '' },
    { name: 'HRA', amount: '' },
    { name: 'Conveyance Allowance', amount: '' },
  ]);
  const [deductions, setDeductions] = useState([
    { name: 'PF', amount: '' },
    { name: 'ESI/Health Insurance', amount: '' },
    { name: 'Professional Tax', amount: '' },
  ]);
  const [rejectionData, setRejectionData] = useState({
    reason: '',
    customReason: '',
    feedback: ''
  });
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  // Build a professional HTML from current offerData and candidate/assessment context
  const buildOfferHtml = () => {
    const companyName = 'Your Company';
    const jobTitle = offerData.position || assessmentData?.jobTitle || 'Position';
    const candidateName = candidateData?.name || candidateData?.email || 'Candidate';
    const startDate = offerData.startDate ? new Date(offerData.startDate).toLocaleDateString() : 'To be determined';
    const today = new Date().toLocaleDateString();
    const benefitsList = (offerData.benefits || '').split('\n').filter(Boolean).map(b => `<li>${b}</li>`).join('');

    return `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 780px; margin: 0 auto; color: #111827;">
        <div style="display:flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
          <div>
            <h1 style="margin:0; font-size: 22px; color:#111827;">Offer of Employment</h1>
            <p style="margin:4px 0; font-size: 12px; color:#6b7280;">${today}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:600;">${companyName}</div>
            <div style="font-size:12px; color:#6b7280;">Human Resources</div>
          </div>
        </div>

        <p style="margin-top: 24px;">Dear <strong>${candidateName}</strong>,</p>
        <p>
          We are pleased to extend to you an offer of employment for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.
          Following your assessment and interview, we believe your skills and experience will be a great addition to our team.
        </p>

        <h3 style="margin-top: 20px; font-size: 16px;">Position Details</h3>
        <ul style="margin: 8px 0 0 18px;">
          <li><strong>Position:</strong> ${jobTitle}</li>
          <li><strong>Start Date:</strong> ${startDate}</li>
          <li><strong>Salary:</strong> ${offerData.salary || 'To be discussed'}</li>
        </ul>

        ${benefitsList ? `
          <h3 style="margin-top: 16px; font-size: 16px;">Benefits</h3>
          <ul style="margin: 8px 0 0 18px;">${benefitsList}</ul>
        ` : ''}

        ${offerData.notes ? `
          <h3 style="margin-top: 16px; font-size: 16px;">Additional Terms</h3>
          <p>${offerData.notes}</p>
        ` : ''}

        <p style="margin-top: 16px;">
          Please confirm your acceptance of this offer by replying to this email. We look forward to welcoming you to the team.
        </p>

        <div style="margin-top: 28px;">
          <div>Best regards,</div>
          <div style="margin-top: 12px;">HR Team</div>
          <div>${companyName}</div>
        </div>
      </div>
    `;
  };

  // TipTap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: offerHtml,
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[160px] w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      // When editing in Form, keep offerHtml in sync.
      // When editing inline in Preview, do not override preview edits.
      if (!inlinePreviewEdit) {
        setOfferHtml(editor.getHTML());
      }
    },
  });

  // Reusable loader for draft
  const loadDraft = async () => {
    try {
      if (!showOfferModal) return;
      setOfferPreviewTab('form');
      const draftRes = await axiosInstance.post('/api/offers/draft', {
        candidateId,
        assessmentSessionId,
        template: offerTemplate,
      });
      let draft = draftRes?.data?.draftHtml || buildOfferHtml();
      draft = composeOfferHtml(draft);
      setOfferHtml(draft);
      setTimeout(() => editor?.commands.setContent(draft), 0);
    } catch (e) {
      console.error('Failed to load offer draft:', e);
      const fallback = buildOfferHtml();
      setOfferHtml(fallback);
      setTimeout(() => editor?.commands.setContent(fallback), 0);
    }
  };

  // Load draft on modal open
  useEffect(() => { loadDraft(); /* eslint-disable-next-line */ }, [showOfferModal]);
  // Refresh draft when template changes while modal is open
  useEffect(() => { if (showOfferModal) loadDraft(); /* eslint-disable-next-line */ }, [offerTemplate]);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId, assessmentSessionId]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching candidate details for:', { candidateId, assessmentSessionId });
      
      const response = await axiosInstance.get(`/api/candidates/${candidateId}/details`, {
        params: { assessmentSessionId }
      });
      
      console.log('API Response:', response.data);
      
      setCandidateData(response.data.candidate);
      setAssessmentData(response.data.assessment);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to fetch candidate details');
    } finally {
      setLoading(false);
    }
  };

  const handleExternalScheduling = async (platform) => {
    const candidateEmail = candidateData?.email || '';
    const candidateName = candidateData?.name || 'Candidate';
    const jobTitle = assessmentData?.jobTitle || 'Position';
    const hrEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '';

    const eventTitle = `Interview - ${jobTitle}`;
    const eventDescription = `Interview with ${candidateName} for ${jobTitle} position`;
    
    let calendarUrl = '';
    
    switch (platform) {
      case 'google-meet':
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&add=${encodeURIComponent(candidateEmail)}&add=${encodeURIComponent(hrEmail)}`;
        break;
      case 'microsoft-teams':
        calendarUrl = `https://outlook.office.com/calendar/0/deeplink/compose?to=${encodeURIComponent(candidateEmail)}&subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(eventDescription)}`;
        break;
      case 'zoom':
        calendarUrl = `https://zoom.us/schedule?email=${encodeURIComponent(candidateEmail)}&topic=${encodeURIComponent(eventTitle)}`;
        break;
      default:
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&add=${encodeURIComponent(candidateEmail)}`;
    }

    // Ensure interview exists and mark as scheduled locally
    try {
      await ensureInterviewForSession();
      setInterviewStatus('scheduled');
    } catch (e) {
      // ensureInterviewForSession has its own toast on failure; continue to open calendar anyway
    }
    setShowSchedulingDropdown(false);
    
    // Open external calendar platform
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    
    toast.success(`Opening ${platform === 'google-meet' ? 'Google Calendar' : platform === 'microsoft-teams' ? 'Microsoft Teams' : 'Zoom'} for scheduling. Status marked as Scheduled.`);
  };

  const handleInterviewCompleted = async () => {
    try {
      await ensureInterviewForSession();
      setInterviewStatus('completed');
      toast.success('Interview marked as completed. Please add feedback.');
    } catch (e) {
      // ensureInterviewForSession already toasts on failure
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await axiosInstance.post('/api/interviews/feedback', {
        candidateId,
        assessmentSessionId,
        ...interviewFeedback
      });
      
      toast.success('Interview feedback submitted successfully!');
      setShowFeedbackModal(false);
      
      // Enable decision making after feedback is submitted
      setInterviewFeedback(prev => ({ ...prev, feedbackSubmitted: true }));
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const handleSelectCandidate = async (offerPayload) => {
    console.log('[Submit] Select Candidate', { candidateId, assessmentSessionId, offerPayload });
    
    // Check if feedback is required and not submitted
    if (interviewStatus === 'completed' && !interviewFeedback.feedbackSubmitted) {
      toast.warning('Please submit interview feedback before making a decision.');
      setShowFeedbackModal(true);
      return;
    }

    // Validate required offer fields
    if (!offerPayload.position || !offerPayload.salary || !offerPayload.startDate) {
      toast.error('Please fill Position, Salary, and Start Date before sending the offer.');
      return;
    }
    
    if (!offerPayload.offerContent || offerPayload.offerContent.trim().length < 30) {
      toast.error('Offer content is empty. Please review and update the letter.');
      return;
    }

    try {
      setIsSubmittingOffer(true);
      const response = await axiosInstance.post('/api/candidates/select', {
        candidateId,
        assessmentSessionId,
        offerData: offerPayload,
        offerHtml: offerPayload.offerContent, // HTML content for PDF generation
        interviewFeedback: interviewFeedback.feedbackSubmitted ? interviewFeedback : null
      });
      console.log('[API] /api/candidates/select response', response?.data);
      
      toast.success('Professional offer letter sent to candidate with PDF attachment!');
      toast.success('HR copy sent successfully!');
      setShowOfferModal(false);
      navigate('/dashboard/candidates');
      
    } catch (error) {
      console.error('Error selecting candidate:', error);
      toast.error('Failed to send offer letter');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleRejectCandidate = async () => {
    console.log('[Submit] Reject Candidate', { candidateId, assessmentSessionId, rejectionData });
    
    // Validate rejection data
    if (!rejectionData.reason) {
      toast.error('Please select a reason for rejection.');
      return;
    }
    
    if (rejectionData.reason === 'custom' && !rejectionData.customReason.trim()) {
      toast.error('Please provide a custom reason for rejection.');
      return;
    }
    
    // Check if feedback is required and not submitted
    if (interviewStatus === 'completed' && !interviewFeedback.feedbackSubmitted) {
      toast.warning('Please submit interview feedback before making a decision.');
      setShowFeedbackModal(true);
      return;
    }

    try {
      setIsSubmittingReject(true);
      const response = await axiosInstance.post('/api/candidates/reject', {
        candidateId,
        assessmentSessionId,
        rejectionData,
        interviewFeedback: interviewFeedback.feedbackSubmitted ? interviewFeedback : null
      });
      console.log('[API] /api/candidates/reject response', response?.data);
      
      toast.success('Candidate rejected successfully!');
      toast.success(`Professional rejection email sent to ${candidateData.email}`);
      setShowRejectModal(false);
      navigate('/dashboard/candidates');
      
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      toast.error('Failed to reject candidate');
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const viewDocument = async (type, documentId) => {
    try {
      const endpoint = type === 'resume' 
        ? `/api/resumes/${documentId}` 
        : `/api/job-descriptions/${documentId}`;
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.url) {
        window.open(response.data.url, '_blank', 'noopener,noreferrer');
      } else {
        toast.error(`Failed to view ${type}`);
      }
    } catch (error) {
      console.error(`Error viewing ${type}:`, error);
      toast.error(`Failed to view ${type}`);
    }
  };

  const downloadDocument = async (type, documentId, filename) => {
    try {
      const endpoint = type === 'resume' 
        ? `/api/resumes/${documentId}` 
        : `/api/job-descriptions/${documentId}`;
      
      const response = await axiosInstance.get(endpoint, {
        params: { download: true }
      });
      
      if (response.data.url) {
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = filename || `${type}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(`Failed to download ${type}`);
      }
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
      toast.error(`Failed to download ${type}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-600 mb-4" />
          <p className="text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faTimesCircle} size="3x" className="text-red-500 mb-4" />
          <p className="text-gray-600 mb-4">Candidate details not found</p>
          <Button onClick={() => navigate('/dashboard/candidates')}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/candidates')}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {candidateData.name || 'Candidate Details'}
                </h1>
                <p className="text-gray-600">{candidateData.email}</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Interview Scheduling */}
              {interviewStatus === 'not-scheduled' && (
                <div className="relative">
              <Button
                    onClick={() => setShowSchedulingDropdown(!showSchedulingDropdown)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Schedule Interview
                    <FontAwesomeIcon 
                      icon={showSchedulingDropdown ? faChevronUp : faChevronDown} 
                      className="ml-2" 
                    />
                  </Button>
                  
{showSchedulingDropdown && (
  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
    <div className="p-2">
      <button
        onClick={() => handleExternalScheduling('google-meet')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faGoogleBrand} className="mr-2 text-blue-500" />
        Google Calendar
        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-auto text-xs" />
      </button>
      <button
        onClick={() => handleExternalScheduling('microsoft-teams')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faMicrosoftBrand} className="mr-2 text-blue-600" />
        Microsoft Teams
        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-auto text-xs" />
      </button>
      <button
        onClick={() => handleExternalScheduling('zoom')}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faVideo} className="mr-2 text-blue-700" /> {/* Replaced faZoom with faVideo */}
        Zoom
        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-auto text-xs" />
      </button>
    </div>
  </div>
)}                </div>
              )}

              {/* Interview Completed Button */}
              {interviewStatus === 'scheduled' && (
                <Button
                  onClick={handleInterviewCompleted}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Mark Interview Complete
                </Button>
              )}

              {/* Interview Feedback Button */}
              {interviewStatus === 'completed' && !interviewFeedback.feedbackSubmitted && (
                <Button
                  onClick={async () => { try { await ensureInterviewForSession(); setShowFeedbackModal(true); } catch(e){} }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FontAwesomeIcon icon={faComments} className="mr-2" />
                  Add Interview Feedback
              </Button>
              )}

              {/* Decision Buttons - Always visible; validation happens on submit */}
              <>
                <Button
                  onClick={() => {
                    console.log('[UI] Open Offer Modal');
                    setShowOfferModal(true);
                  }}
                  className={`bg-green-600 hover:bg-green-700 text-white ${isSubmittingOffer ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmittingOffer}
                >
                  <FontAwesomeIcon icon={faHandshake} className="mr-2" />
                  {isSubmittingOffer ? 'Processing…' : 'Select Candidate'}
                </Button>
                
                <Button
                  onClick={async () => {
                    try {
                      console.log('[UI] Sending Interview Invitation');
                      await axiosInstance.post('/api/interviews/send-invitation', {
                        candidateId,
                        assessmentSessionId,
                        interviewDetails: {
                          dateTime: 'To be scheduled',
                          platform: 'To be confirmed',
                          duration: '45-60 minutes'
                        }
                      });
                      toast.success('🎉 Interview invitation sent to candidate successfully!');
                      toast.success('📧 HR notification sent - Check your email for confirmation!');
                    } catch (error) {
                      console.error('Error sending interview invitation:', error);
                      toast.error('Failed to send interview invitation');
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FontAwesomeIcon icon={faEnvelopeOpen} className="mr-2" />
                  Send Interview Invitation
                </Button>
                
                <Button
                  onClick={() => {
                    console.log('[UI] Open Reject Modal');
                    setShowRejectModal(true);
                  }}
                  variant="outline"
                  className={`border-red-300 text-red-600 hover:bg-red-50 ${isSubmittingReject ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmittingReject}
                >
                  <FontAwesomeIcon icon={faUserTimes} className="mr-2" />
                  {isSubmittingReject ? 'Processing…' : 'Reject'}
                </Button>
              </>

              {/* Feedback Submitted Indicator */}
              {interviewFeedback.feedbackSubmitted && (
                <div className="flex items-center text-green-600">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  <span className="text-sm">Feedback Submitted</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: faUser },
                { id: 'assessment', label: 'Assessment Report', icon: faChartBar },
                { id: 'documents', label: 'Documents', icon: faFileAlt },
                { id: 'interview', label: 'Interview History', icon: faCalendarAlt }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{candidateData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{candidateData.mobile_number || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 w-4" />
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{candidateData.experience || 'N/A'} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidateData.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      )) || <span className="text-gray-500">No skills listed</span>}
                    </div>
                  </div>
                </div>

                {/* Assessment Summary */}
                {assessmentData && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="text-indigo-600" />
                      Assessment Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {assessmentData.testResult?.score?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">MCQ Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {assessmentData.testResult?.audioScore?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Audio Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {assessmentData.testResult?.videoScore?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Video Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {assessmentData.testResult?.combinedScore?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Combined Score</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assessment' && assessmentData && (
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Assessment Results</h3>
                  {/* Assessment details would go here */}
                  <p className="text-gray-600">Detailed assessment analysis and insights...</p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resume */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} className="text-blue-600" />
                      Resume
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">{candidateData.resume?.filename || 'N/A'}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => viewDocument('resume', candidateData.resume?._id)}
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument('resume', candidateData.resume?._id, candidateData.resume?.filename)}
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} className="text-green-600" />
                      Job Description
                    </h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">{assessmentData?.jobDescription?.filename || 'N/A'}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => viewDocument('job-description', assessmentData?.jobDescription?._id)}
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument('job-description', assessmentData?.jobDescription?._id, assessmentData?.jobDescription?.filename)}
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'interview' && (
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview History</h3>
                  <p className="text-gray-600">No interviews scheduled yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interview Scheduling Modal */}
        {/* Advanced Offer Letter Editor */}
        <AdvancedOfferEditor
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          candidateData={candidateData}
          assessmentData={assessmentData}
          onSave={handleSelectCandidate}
        />

        {/* Reject Candidate Modal */}
        <Dialog
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Candidate"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
              <select
                value={rejectionData.reason}
                onChange={(e) => setRejectionData({ ...rejectionData, reason: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select a reason</option>
                <option value="requirements-not-matching">Requirements not matching</option>
                <option value="location-not-suitable">Location not suitable</option>
                <option value="resume-referred-other-roles">Resume referred for other roles</option>
                <option value="custom">Custom reason</option>
              </select>
            </div>
            {rejectionData.reason === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Reason</label>
                <input
                  type="text"
                  value={rejectionData.customReason}
                  onChange={(e) => setRejectionData({ ...rejectionData, customReason: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter custom reason"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional)</label>
              <textarea
                value={rejectionData.feedback}
                onChange={(e) => setRejectionData({ ...rejectionData, feedback: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="Provide constructive feedback to the candidate"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectCandidate}
                className={`bg-red-600 hover:bg-red-700 text-white ${
                  !rejectionData.reason || (rejectionData.reason === 'custom' && !rejectionData.customReason.trim()) || isSubmittingReject
                    ? 'opacity-70 cursor-not-allowed' 
                    : ''
                }`}
                disabled={!rejectionData.reason || (rejectionData.reason === 'custom' && !rejectionData.customReason.trim()) || isSubmittingReject}
              >
                <FontAwesomeIcon icon={faUserTimes} className="mr-2" />
                {isSubmittingReject ? 'Processing...' : 'Reject Candidate'}
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Interview Feedback Modal */}
        <Dialog
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          title="Interview Feedback"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setInterviewFeedback({ ...interviewFeedback, rating })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      interviewFeedback.rating >= rating
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {interviewFeedback.rating === 0 && 'Please select a rating'}
                {interviewFeedback.rating === 1 && 'Poor'}
                {interviewFeedback.rating === 2 && 'Below Average'}
                {interviewFeedback.rating === 3 && 'Average'}
                {interviewFeedback.rating === 4 && 'Good'}
                {interviewFeedback.rating === 5 && 'Excellent'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interview Feedback</label>
              <textarea
                value={interviewFeedback.feedback}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, feedback: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="4"
                placeholder="Detailed feedback about the interview performance..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
              <textarea
                value={interviewFeedback.strengths}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, strengths: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="What are the candidate's key strengths?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement</label>
              <textarea
                value={interviewFeedback.areasForImprovement}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, areasForImprovement: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="What areas could the candidate improve?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
              <select
                value={interviewFeedback.recommendation}
                onChange={(e) => setInterviewFeedback({ ...interviewFeedback, recommendation: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="pending">Pending Decision</option>
                <option value="proceed">Proceed to Next Round</option>
                <option value="reject">Reject Candidate</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!interviewFeedback.feedback.trim() || interviewFeedback.rating === 0}
              >
                <FontAwesomeIcon icon={faComments} className="mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default CandidateDetailsPage;
