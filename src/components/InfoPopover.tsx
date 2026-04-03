import { useState } from 'react';

export function InfoPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#666',
          padding: '4px',
        }}
      >
        ℹ️
      </button>
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '8px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              width: '300px',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            <strong>Glaze Rate</strong> measures how often a model validates wrong or bad ideas
            when presented confidently.
            <br />
            <br />
            Lower is better. A model that always says "No" (pushes back correctly) scores 0%.
          </div>
        </>
      )}
    </div>
  );
}
