import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faMapMarkerAlt,
  faRocket, faBuilding, faClock, faCalendarAlt,
  faMoneyBillWave, faUserTie, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const ComprehensiveOfferForm = ({ offerData, setOfferData, validationErrors }) => {
  // Use useCallback to prevent re-rendering issues that cause input focus loss
  const handleInputChange = useCallback((field, value) => {
    setOfferData(prev => ({ ...prev, [field]: value }));
  }, [setOfferData]);

  const InputField = useCallback(({ 
    label, 
    field, 
    type = 'text', 
    icon, 
    required = false, 
    placeholder = '', 
    options = null 
  }) => (
    <div className="space-y-2 relative" style={{ pointerEvents: 'auto', zIndex: 1 }}>
      <label 
        htmlFor={`input-${field}`}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer"
      >
        <FontAwesomeIcon icon={icon} className="text-blue-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select
          id={`input-${field}`}
          value={offerData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white relative ${
            validationErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{ 
            pointerEvents: 'auto', 
            zIndex: 2,
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
          }}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={`input-${field}`}
          type={type}
          value={offerData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white relative ${
            validationErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{ 
            pointerEvents: 'auto', 
            zIndex: 2,
            WebkitAppearance: 'none'
          }}
        />
      )}
      {validationErrors[field] && (
        <p className="text-red-500 text-sm flex items-center gap-1 relative" style={{ zIndex: 3 }}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationErrors[field]}
        </p>
      )}
    </div>
  ), [offerData, validationErrors, handleInputChange]);

  const TextAreaField = useCallback(({ label, field, icon, required = false, placeholder = '', rows = 3 }) => (
    <div className="space-y-2 relative" style={{ pointerEvents: 'auto', zIndex: 1 }}>
      <label 
        htmlFor={`textarea-${field}`}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer"
      >
        <FontAwesomeIcon icon={icon} className="text-blue-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={`textarea-${field}`}
        value={offerData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        autoComplete="off"
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none bg-white relative ${
          validationErrors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        style={{ 
          pointerEvents: 'auto', 
          zIndex: 2,
          WebkitAppearance: 'none'
        }}
      />
      {validationErrors[field] && (
        <p className="text-red-500 text-sm flex items-center gap-1 relative" style={{ zIndex: 3 }}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {validationErrors[field]}
        </p>
      )}
    </div>
  ), [offerData, validationErrors, handleInputChange]);

  return (
    <div 
      className="space-y-8 relative" 
      style={{ 
        pointerEvents: 'auto', 
        zIndex: 1,
        isolation: 'isolate' // Creates new stacking context
      }}
    >
      {/* Candidate Information Section */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        style={{ pointerEvents: 'auto', zIndex: 2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Candidate Information</h3>
            <p className="text-gray-600 text-sm">Personal details of the candidate</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Candidate Full Name"
            field="candidateName"
            icon={faUser}
            required
            placeholder="Enter candidate's full name"
          />
          <InputField
            label="Email Address"
            field="candidateEmail"
            type="email"
            icon={faEnvelope}
            required
            placeholder="candidate@email.com"
          />
          <InputField
            label="Phone Number"
            field="candidatePhone"
            type="tel"
            icon={faPhone}
            placeholder="+91 XXXXXXXXXX"
          />
          <TextAreaField
            label="Address"
            field="candidateAddress"
            icon={faMapMarkerAlt}
            placeholder="Complete address with city, state, pincode"
            rows={2}
          />
        </div>
      </div>

      {/* Position Details Section */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        style={{ pointerEvents: 'auto', zIndex: 2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faRocket} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Position Details</h3>
            <p className="text-gray-600 text-sm">Job role and employment information</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Job Title/Position"
            field="position"
            icon={faRocket}
            required
            placeholder="e.g., Senior Software Engineer"
          />
          <InputField
            label="Department"
            field="department"
            icon={faBuilding}
            required
            placeholder="e.g., Engineering, Marketing"
          />
          <InputField
            label="Employment Type"
            field="employmentType"
            icon={faClock}
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' }
            ]}
          />
          <InputField
            label="Reporting Manager"
            field="reportingManager"
            icon={faUserTie}
            placeholder="Manager's name and designation"
          />
          <InputField
            label="Work Location"
            field="workLocation"
            icon={faMapMarkerAlt}
            options={[
              { value: 'Office', label: 'Office' },
              { value: 'Remote', label: 'Remote' },
              { value: 'Hybrid', label: 'Hybrid' }
            ]}
          />
          <InputField
            label="Working Hours"
            field="workingHours"
            icon={faClock}
            placeholder="e.g., 9 AM to 6 PM"
          />
        </div>
      </div>

      {/* Salary & Benefits Section */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        style={{ pointerEvents: 'auto', zIndex: 2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Salary & Benefits</h3>
            <p className="text-gray-600 text-sm">Compensation and benefits package</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Annual Salary"
            field="salary"
            type="number"
            icon={faMoneyBillWave}
            required
            placeholder="e.g., 800000"
          />
          <InputField
            label="Currency"
            field="currency"
            icon={faMoneyBillWave}
            options={[
              { value: 'INR', label: 'INR (₹)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'EUR', label: 'EUR (€)' }
            ]}
          />
          <InputField
            label="Salary Frequency"
            field="salaryFrequency"
            icon={faCalendarAlt}
            options={[
              { value: 'per annum', label: 'Per Annum' },
              { value: 'per month', label: 'Per Month' },
              { value: 'per hour', label: 'Per Hour' }
            ]}
          />
        </div>
        
        <div className="mt-6">
          <TextAreaField
            label="Benefits & Perks"
            field="benefits"
            icon={faRocket}
            placeholder="Health insurance, PF, gratuity, flexible hours, etc."
            rows={3}
          />
        </div>
      </div>

      {/* Dates & Terms Section */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        style={{ pointerEvents: 'auto', zIndex: 2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Important Dates & Terms</h3>
            <p className="text-gray-600 text-sm">Employment dates and conditions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Start Date"
            field="startDate"
            type="date"
            icon={faCalendarAlt}
            required
          />
          <InputField
            label="End Date (if contract)"
            field="endDate"
            type="date"
            icon={faCalendarAlt}
          />
          <InputField
            label="Probation Period"
            field="probationPeriod"
            icon={faClock}
            placeholder="e.g., 3 months"
          />
          <InputField
            label="Notice Period"
            field="noticePeriod"
            icon={faClock}
            placeholder="e.g., 30 days"
          />
          <InputField
            label="Working Days"
            field="workingDays"
            icon={faCalendarAlt}
            placeholder="e.g., Monday to Friday"
          />
          <InputField
            label="Interview Date"
            field="interviewDate"
            type="date"
            icon={faCalendarAlt}
          />
        </div>
      </div>

      {/* Company Information Section */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        style={{ pointerEvents: 'auto', zIndex: 2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faBuilding} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Company Information</h3>
            <p className="text-gray-600 text-sm">Organization details and contact information</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Company Name"
            field="companyName"
            icon={faBuilding}
            required
            placeholder="e.g., Cognibotz"
          />
          <InputField
            label="Company Website"
            field="companyWebsite"
            type="url"
            icon={faBuilding}
            placeholder="https://company.com"
          />
          <InputField
            label="Company Phone"
            field="companyPhone"
            type="tel"
            icon={faPhone}
            placeholder="+91 XXXXXXXXXX"
          />
          <InputField
            label="Company Email"
            field="companyEmail"
            type="email"
            icon={faEnvelope}
            placeholder="contact@company.com"
          />
        </div>
        
        <div className="mt-6">
          <TextAreaField
            label="Company Address"
            field="companyAddress"
            icon={faMapMarkerAlt}
            required
            placeholder="Complete company address with city, state, pincode"
            rows={2}
          />
        </div>
      </div>

      {/* HR Information Section */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        style={{ pointerEvents: 'auto', zIndex: 2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faUserTie} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">HR Contact Information</h3>
            <p className="text-gray-600 text-sm">HR representative details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="HR Name"
            field="hrName"
            icon={faUserTie}
            required
            placeholder="HR representative name"
          />
          <InputField
            label="HR Title"
            field="hrTitle"
            icon={faUserTie}
            placeholder="e.g., HR Manager"
          />
          <InputField
            label="HR Email"
            field="hrEmail"
            type="email"
            icon={faEnvelope}
            required
            placeholder="hr@company.com"
          />
          <InputField
            label="HR Phone"
            field="hrPhone"
            type="tel"
            icon={faPhone}
            placeholder="+91 XXXXXXXXXX"
          />
        </div>
      </div>

      {/* Additional Terms Section */}
      <div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        style={{ pointerEvents: 'auto', zIndex: 2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faRocket} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Additional Terms & Conditions</h3>
            <p className="text-gray-600 text-sm">Special conditions and additional information</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <TextAreaField
            label="Additional Terms"
            field="additionalTerms"
            icon={faRocket}
            placeholder="Any additional terms and conditions..."
            rows={3}
          />
          <TextAreaField
            label="Special Conditions"
            field="specialConditions"
            icon={faRocket}
            placeholder="Special conditions or requirements..."
            rows={3}
          />
          <TextAreaField
            label="Interview Feedback"
            field="interviewFeedback"
            icon={faUserTie}
            placeholder="Summary of interview performance..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveOfferForm;
