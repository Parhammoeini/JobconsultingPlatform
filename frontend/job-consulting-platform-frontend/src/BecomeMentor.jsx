import React from 'react';

const BecomeMentor = ({ setView }) => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => setView("dashboard")} 
        style={{ float: 'left', padding: '8px 16px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
      >
        ← Back to Dashboard
      </button>
      <div style={{ clear: 'both', marginBottom: '40px' }}></div>
      
      <h1 style={{ fontSize: '2.5rem', color: '#2d3436' }}>Share your expertise</h1>
      <p style={{ fontSize: '1.2rem', color: '#636e72', marginBottom: '40px' }}>
        Join our platform to mentor aspiring professionals, set your own schedule, and earn while helping others succeed.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#0984e3', marginBottom: '10px' }}>Flexibility</h3>
          <p style={{ color: '#636e72', lineHeight: '1.5' }}>Set your own hours and availability. Work whenever you want from anywhere.</p>
        </div>
        <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#0984e3', marginBottom: '10px' }}>Impact</h3>
          <p style={{ color: '#636e72', lineHeight: '1.5' }}>Guide students and professionals to achieve their career goals and make a real difference.</p>
        </div>
        <div style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#0984e3', marginBottom: '10px' }}>Extra Income</h3>
          <p style={{ color: '#636e72', lineHeight: '1.5' }}>Determine your own consulting rates and get paid securely through our platform.</p>
        </div>
      </div>

      <button 
        onClick={() => setView("mentor-form")}
        style={{ 
          padding: '15px 40px', 
          fontSize: '1.2rem', 
          backgroundColor: '#0984e3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '30px', 
          cursor: 'pointer', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#074e8c'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#0984e3'}
      >
        Apply Now
      </button>
    </div>
  );
};

export default BecomeMentor;
