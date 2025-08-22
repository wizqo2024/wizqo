import React from 'react';

interface SimpleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleAuthModal({ isOpen, onClose }: SimpleAuthModalProps) {
  console.log('SimpleAuthModal render - isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }

  console.log('Modal IS OPEN - rendering modal');
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          🎉 Great Job!
        </h2>
        <p style={{ marginBottom: '30px', color: '#666' }}>
          You completed Day 1! Sign up to save your progress and continue your learning journey.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#8B5CF6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sign Up
          </button>
          <button 
            onClick={() => {
              localStorage.setItem('skipAuthPrompt', 'true');
              onClose();
            }}
            style={{
              backgroundColor: '#E5E7EB',
              color: '#374151',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}