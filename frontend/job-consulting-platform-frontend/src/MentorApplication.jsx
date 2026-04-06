import React, { useState } from 'react';
import { registerConsultant } from './api';

const MentorApplication = ({ setView }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
    education: '',
    experiences: [],
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Basic validation
    if (step === 1 && (!formData.name || !formData.email || !formData.location || !formData.bio)) {
      alert("Please fill out all basic fields.");
      return;
    }
    if (step === 2 && (!formData.education)) {
      alert("Please provide your education details.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { title: '', duration: '', description: '' }]
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExps = [...formData.experiences];
    newExps[index][field] = value;
    setFormData(prev => ({ ...prev, experiences: newExps }));
  };

  const handleRemoveExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.specialization) {
      alert("Please enter your specialization.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        experiences: JSON.stringify(formData.experiences)
      };
      await registerConsultant(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '60px 40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', borderRadius: '8px', marginTop: '40px' }}>
        <h2 style={{ color: '#00b894', marginBottom: '20px' }}>Application Submitted Successfully!</h2>
        <p style={{ color: '#636e72', margin: '20px 0', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Thank you for applying to be a consultant. Our team will review your application and you will hear back shortly regarding the next steps.
        </p>
        <button 
          onClick={() => setView("dashboard")}
          style={{ padding: '12px 24px', backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', fontSize: '1rem' }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => setView("mentor-benefits")} 
        style={{ marginBottom: '30px', padding: '8px 16px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', fontSize: '0.9rem' }}
      >
        ← Back to Benefits
      </button>

      <h2 style={{ color: '#2d3436', marginBottom: '20px', textAlign: 'center' }}>Become a Consultant</h2>
      
      <div style={{ display: 'flex', marginBottom: '40px', borderBottom: '2px solid #dfe6e9', paddingBottom: '15px' }}>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: step === 1 ? '700' : '400', color: step === 1 ? '#0984e3' : '#b2bec3', borderBottom: step === 1 ? '3px solid #0984e3' : 'none', paddingBottom: '10px', transition: 'all 0.3s' }}>
          Step 1: About You
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: step === 2 ? '700' : '400', color: step === 2 ? '#0984e3' : '#b2bec3', borderBottom: step === 2 ? '3px solid #0984e3' : 'none', paddingBottom: '10px', transition: 'all 0.3s' }}>
          Step 2: Experience
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: step === 3 ? '700' : '400', color: step === 3 ? '#0984e3' : '#b2bec3', borderBottom: step === 3 ? '3px solid #0984e3' : 'none', paddingBottom: '10px', transition: 'all 0.3s' }}>
          Step 3: Specialization
        </div>
      </div>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fab1a0', color: '#2d3436', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {step === 1 && (
          <>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#2d3436', fontWeight: '500' }}>
              Full Name
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="e.g. John Doe"
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid #b2bec3', fontSize: '1rem' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#2d3436', fontWeight: '500' }}>
              Email Address
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid #b2bec3', fontSize: '1rem' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#2d3436', fontWeight: '500' }}>
              Location
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                placeholder="e.g. New York, USA"
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid #b2bec3', fontSize: '1rem' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#2d3436', fontWeight: '500' }}>
              About Yourself
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                required 
                rows="3"
                placeholder="A short summary of who you are..."
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid #b2bec3', fontSize: '1rem', resize: 'vertical' }}
              />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#2d3436', fontWeight: '500' }}>
              Education
              <input 
                type="text" 
                name="education" 
                value={formData.education} 
                onChange={handleChange} 
                required 
                placeholder="e.g. BSc Computer Science, Stanford University"
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid #b2bec3', fontSize: '1rem' }}
              />
            </label>
            
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ color: '#2d3436', margin: 0 }}>Work Experience</h3>
                <span style={{ fontSize: '0.85rem', color: '#636e72', fontWeight: 'bold' }}>Total: {formData.experiences.length}</span>
              </div>
              
              {formData.experiences.map((exp, index) => (
                <div key={index} style={{ padding: '15px', border: '1px solid #dfe6e9', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#fdfdfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#636e72' }}>Experience #{index + 1}</strong>
                    <button type="button" onClick={() => handleRemoveExperience(index)} style={{ color: '#d63031', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>Remove</button>
                  </div>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '500' }}>
                    Job Title
                    <input type="text" value={exp.title} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #b2bec3' }} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '500' }}>
                    Duration
                    <input type="text" placeholder="e.g. 2 years (2020 - 2022)" value={exp.duration} onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #b2bec3' }} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                    Description
                    <textarea rows="2" value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #b2bec3', resize: 'vertical' }} />
                  </label>
                </div>
              ))}
              <button type="button" onClick={handleAddExperience} style={{ padding: '8px 16px', background: '#dfe6e9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#2d3436', fontWeight: 'bold' }}>
                + Add Experience
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#2d3436', fontWeight: '500' }}>
              Area of Specialization
              <input 
                type="text" 
                name="specialization" 
                value={formData.specialization} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Software Engineering, Career Coaching..."
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid #b2bec3', fontSize: '1rem' }}
              />
            </label>
            <p style={{ fontSize: '0.85rem', color: '#636e72', marginTop: '-10px' }}>
              Specify the primary area you'd like to consult in. You can add more later.
            </p>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {step > 1 ? (
            <button type="button" onClick={handleBack} style={{ padding: '12px 24px', backgroundColor: '#dfe6e9', color: '#2d3436', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
              Previous
            </button>
          ) : (
            <div /> // Spacer
          )}
          
          {step < 3 ? (
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
              Next Step
            </button>
          ) : (
            <button type="submit" disabled={loading} style={{ padding: '12px 24px', backgroundColor: '#00b894', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MentorApplication;