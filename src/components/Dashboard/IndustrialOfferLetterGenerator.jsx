import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faUpload, faEdit, faDownload,
  faCheckCircle, faExclamationTriangle, faSpinner,
  faPaperPlane, faEye, faTrash
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const IndustrialOfferLetterGenerator = () => {
  const [activeStep, setActiveStep] = useState('upload'); // upload, form, preview, download
  const [letterhead, setLetterhead] = useState(null);
  const [offerData, setOfferData] = useState({
    candidateName: '',
    candidateEmail: '',
    candidateAddress: '',
    position: '',
    department: '',
    startDate: '',
    employmentType: 'Full-time',
    reportingManager: '',
    workLocation: '',
    workingHours: '9:00 AM to 6:00 PM, Monday to Friday',
    salary: '',
    basic: '',
    hra: '',
    allowance: '',
    employerPf: '',
    benefits: '',
    probationPeriod: '3 months',
    noticePeriod: '30 days',
    offerValidUntil: '',
    offerDate: '',
    additionalTerms: '',
    hrName: '',
    hrTitle: '',
    hrEmail: '',
    hrPhone: '',
    hrContact: '',
    companyName: '',
    companyAddress: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOffer, setGeneratedOffer] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch active letterhead on component mount
  useEffect(() => {
    fetchActiveLetterhead();
  }, []);

  const fetchActiveLetterhead = async () => {
    try {
      const response = await axios.get('/api/letterhead/active');
      if (response.data.success && response.data.letterhead) {
        setLetterhead(response.data.letterhead);
      }
    } catch (err) {
      console.error('Error fetching letterhead:', err);
    }
  };

  const handleLetterheadUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('letterhead', file);

    try {
      setError(null);
      const response = await axios.post('/api/letterhead/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setLetterhead(response.data);
        setSuccess('Letterhead uploaded successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload letterhead');
    }
  };

  const handleInputChange = (field, value) => {
    setOfferData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!offerData.candidateName.trim()) {
      errors.candidateName = 'Candidate name is required';
    }
    
    if (!offerData.candidateEmail.trim()) {
      errors.candidateEmail = 'Candidate email is required';
    } else if (!/\S+@\S+\.\S+/.test(offerData.candidateEmail)) {
      errors.candidateEmail = 'Please enter a valid email address';
    }
    
    if (!offerData.position.trim()) {
      errors.position = 'Position is required';
    }
    
    if (!offerData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!offerData.salary || parseFloat(offerData.salary) <= 0) {
      errors.salary = 'Valid salary (gross CTC) is required and must be greater than 0';
    }
    
    if (!offerData.hrEmail && !offerData.hrContact) {
      errors.hrEmail = 'HR email or contact is required';
    } else if (offerData.hrEmail && !/\S+@\S+\.\S+/.test(offerData.hrEmail)) {
      errors.hrEmail = 'Please enter a valid email address';
    }
    
    if (!offerData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    // Offer validity date validation
    if (offerData.offerValidUntil) {
      const validUntil = new Date(offerData.offerValidUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 30);
      
      if (validUntil < today) {
        errors.offerValidUntil = 'Offer validity date must be in the future';
      } else if (validUntil > maxDate) {
        errors.offerValidUntil = 'Offer validity date cannot be more than 30 days from today';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateOffer = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors before proceeding');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      const response = await axios.post('/api/industrial-offers/generate', {
        offerData: {
          ...offerData,
          candidateId: 'temp_candidate_id', // This would be replaced with actual candidate ID
          assessmentSessionId: 'temp_assessment_id' // This would be replaced with actual assessment ID
        }
      });
      
      if (response.data.success) {
        setGeneratedOffer(response.data.data);
        setActiveStep('preview');
        setSuccess('Offer letter generated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate offer letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!generatedOffer) return;
    
    try {
      const response = await axios.get(`/api/industrial-offers/${generatedOffer.offerLetterId}/download-url`);
      if (response.data.success) {
        setPreviewUrl(response.data.url);
      }
    } catch (err) {
      setError('Failed to generate preview');
    }
  };

  const handleDownload = async () => {
    if (!generatedOffer) return;
    
    try {
      const response = await axios.get(`/api/industrial-offers/${generatedOffer.offerLetterId}/download-url`);
      if (response.data.success) {
        window.open(response.data.url, '_blank');
      }
    } catch (err) {
      setError('Failed to generate download link');
    }
  };

  const resetForm = () => {
    setOfferData({
      candidateName: '',
      candidateEmail: '',
      candidateAddress: '',
      position: '',
      department: '',
      startDate: '',
      employmentType: 'Full-time',
      reportingManager: '',
      workLocation: '',
      workingHours: '9:00 AM to 6:00 PM, Monday to Friday',
      salary: '',
      basic: '',
      hra: '',
      allowance: '',
      employerPf: '',
      benefits: '',
      probationPeriod: '3 months',
      noticePeriod: '30 days',
      offerValidUntil: '',
      offerDate: '',
      additionalTerms: '',
      hrName: '',
      hrTitle: '',
      hrEmail: '',
      hrPhone: '',
      hrContact: '',
      companyName: '',
      companyAddress: ''
    });
    setValidationErrors({});
    setGeneratedOffer(null);
    setPreviewUrl(null);
    setDownloadUrl(null);
    setActiveStep('upload');
  };

  // Input field component
  const InputField = ({ label, field, type = 'text', required = false, placeholder = '', value, onChange, validationError }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      {validationError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationError}
        </p>
      )}
    </div>
  );

  // Textarea field component
  const TextAreaField = ({ label, field, required = false, placeholder = '', rows = 3, value, onChange, validationError }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      />
      {validationError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationError}
        </p>
      )}
    </div>
  );

  // Select field component
  const SelectField = ({ label, field, required = false, options, value, onChange, validationError }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${
          validationError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {validationError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationError}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faFilePdf} />
            Industrial-Grade Offer Letter Generator
          </h1>
          <p className="text-blue-100 mt-2">
            Professional offer letter generation with letterhead integration
          </p>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {['upload', 'form', 'preview', 'download'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep === step 
                    ? 'bg-blue-600 text-white' 
                    : index < ['upload', 'form', 'preview', 'download'].indexOf(activeStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < ['upload', 'form', 'preview', 'download'].indexOf(activeStep) ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className={`text-sm font-medium ${
                    activeStep === step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < ['upload', 'form', 'preview', 'download'].indexOf(activeStep) 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-xl" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
            <span className="text-green-700">{success}</span>
            <button 
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Letterhead Upload */}
          {activeStep === 'upload' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Letterhead</h2>
                <p className="text-gray-600">
                  Upload your company letterhead PDF to be used as the background for offer letters
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="max-w-2xl mx-auto">
                  {letterhead ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Letterhead Uploaded</h3>
                      <p className="text-gray-600 mb-4">
                        {letterhead.originalName} ({Math.round(letterhead.fileSize / 1024)} KB)
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => setActiveStep('form')}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                          Continue to Offer Form
                        </button>
                        <button
                          onClick={resetForm}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                        >
                          Upload Different Letterhead
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faUpload} className="text-blue-600 text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Letterhead PDF</h3>
                      <p className="text-gray-600 mb-6">
                        Upload your company letterhead (PDF only, max 2MB)
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleLetterheadUpload}
                          className="hidden"
                        />
                        <div className="px-6 py-4 bg-white border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors">
                          <p className="text-blue-600 font-medium">Click to browse or drag & drop</p>
                          <p className="text-gray-500 text-sm mt-1">PDF files only (max 2MB)</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Offer Form */}
          {activeStep === 'form' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Letter Details</h2>
                <p className="text-gray-600">
                  Fill in the candidate and position details for the offer letter
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Candidate Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                    Candidate Information
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Full Name"
                      field="candidateName"
                      required
                      placeholder="Enter candidate's full name"
                      value={offerData.candidateName}
                      onChange={handleInputChange}
                      validationError={validationErrors.candidateName}
                    />
                    
                    <InputField
                      label="Email Address"
                      field="candidateEmail"
                      type="email"
                      required
                      placeholder="candidate@example.com"
                      value={offerData.candidateEmail}
                      onChange={handleInputChange}
                      validationError={validationErrors.candidateEmail}
                    />
                    
                    <TextAreaField
                      label="Address"
                      field="candidateAddress"
                      placeholder="Complete address with city, state, pincode"
                      rows={3}
                      value={offerData.candidateAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Position Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faRocket} className="text-green-500" />
                    Position Details
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Job Title/Position"
                      field="position"
                      required
                      placeholder="e.g., Senior Software Engineer"
                      value={offerData.position}
                      onChange={handleInputChange}
                      validationError={validationErrors.position}
                    />
                    
                    <InputField
                      label="Department"
                      field="department"
                      placeholder="e.g., Engineering, Marketing"
                      value={offerData.department}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Start Date"
                      field="startDate"
                      type="date"
                      required
                      value={offerData.startDate}
                      onChange={handleInputChange}
                      validationError={validationErrors.startDate}
                    />
                    
                    <SelectField
                      label="Employment Type"
                      field="employmentType"
                      options={[
                        { value: 'Full-time', label: 'Full-time' },
                        { value: 'Part-time', label: 'Part-time' },
                        { value: 'Contract', label: 'Contract' },
                        { value: 'Intern', label: 'Intern' }
                      ]}
                      value={offerData.employmentType}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Compensation */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-yellow-500" />
                    Compensation
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Annual Salary (CTC)"
                      field="salary"
                      required
                      placeholder="e.g., 800000"
                      value={offerData.salary}
                      onChange={handleInputChange}
                      validationError={validationErrors.salary}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Basic Salary"
                        field="basic"
                        placeholder="e.g., 320000"
                        value={offerData.basic}
                        onChange={handleInputChange}
                      />
                      
                      <InputField
                        label="HRA"
                        field="hra"
                        placeholder="e.g., 160000"
                        value={offerData.hra}
                        onChange={handleInputChange}
                      />
                      
                      <InputField
                        label="Special Allowance"
                        field="allowance"
                        placeholder="e.g., 240000"
                        value={offerData.allowance}
                        onChange={handleInputChange}
                      />
                      
                      <InputField
                        label="Employer PF Contribution"
                        field="employerPf"
                        placeholder="e.g., 96000"
                        value={offerData.employerPf}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <TextAreaField
                      label="Benefits & Perquisites"
                      field="benefits"
                      placeholder="List all benefits and perquisites"
                      rows={3}
                      value={offerData.benefits}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faEdit} className="text-purple-500" />
                    Additional Details
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Reporting Manager"
                      field="reportingManager"
                      placeholder="Manager's name"
                      value={offerData.reportingManager}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Work Location"
                      field="workLocation"
                      placeholder="e.g., Mumbai, Remote"
                      value={offerData.workLocation}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Working Hours"
                      field="workingHours"
                      placeholder="e.g., 9:00 AM to 6:00 PM, Monday to Friday"
                      value={offerData.workingHours}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Probation Period"
                      field="probationPeriod"
                      placeholder="e.g., 3 months"
                      value={offerData.probationPeriod}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Notice Period"
                      field="noticePeriod"
                      placeholder="e.g., 30 days"
                      value={offerData.noticePeriod}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Offer Valid Until"
                      field="offerValidUntil"
                      type="date"
                      value={offerData.offerValidUntil}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* HR & Company Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                    HR & Company Information
                  </h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="HR Name"
                      field="hrName"
                      placeholder="HR Manager's name"
                      value={offerData.hrName}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="HR Title"
                      field="hrTitle"
                      placeholder="e.g., HR Manager, Head of HR"
                      value={offerData.hrTitle}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="HR Email"
                      field="hrEmail"
                      type="email"
                      required
                      placeholder="hr@company.com"
                      value={offerData.hrEmail}
                      onChange={handleInputChange}
                      validationError={validationErrors.hrEmail}
                    />
                    
                    <InputField
                      label="HR Phone"
                      field="hrPhone"
                      placeholder="+91 1234567890"
                      value={offerData.hrPhone}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Company Name"
                      field="companyName"
                      required
                      placeholder="Company name"
                      value={offerData.companyName}
                      onChange={handleInputChange}
                      validationError={validationErrors.companyName}
                    />
                    
                    <TextAreaField
                      label="Company Address"
                      field="companyAddress"
                      placeholder="Complete company address"
                      rows={3}
                      value={offerData.companyAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setActiveStep('upload')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Back to Letterhead
                </button>
                
                <button
                  onClick={handleGenerateOffer}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFilePdf} />
                      Generate Offer Letter
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {activeStep === 'preview' && generatedOffer && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Letter Preview</h2>
                <p className="text-gray-600">
                  Review your offer letter before downloading
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="max-w-4xl mx-auto">
                  {previewUrl ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <iframe
                        src={previewUrl}
                        className="w-full h-[600px]"
                        title="Offer Letter Preview"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faEye} className="text-blue-600 text-2xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Preview Your Offer Letter</h3>
                      <p className="text-gray-600 mb-6">
                        Click the button below to generate a preview of your offer letter
                      </p>
                      <button
                        onClick={handlePreview}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                      >
                        Generate Preview
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => setActiveStep('form')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Back to Form
                </button>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePreview}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    Refresh Preview
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    Download Offer Letter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Download */}
          {activeStep === 'download' && generatedOffer && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Letter Generated</h2>
                <p className="text-gray-600">
                  Your offer letter has been successfully generated
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Offer Letter Ready for Download
                  </h3>
                  
                  <p className="text-gray-600 mb-2">
                    <strong>File:</strong> {generatedOffer.filename}
                  </p>
                  <p className="text-gray-600 mb-8">
                    <strong>Size:</strong> {Math.round(generatedOffer.fileSize / 1024)} KB
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-3 text-lg"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Download Offer Letter
                    </button>
                    
                    <button
                      onClick={() => setActiveStep('preview')}
                      className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-3 text-lg"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View Preview
                    </button>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Another Offer Letter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustrialOfferLetterGenerator;