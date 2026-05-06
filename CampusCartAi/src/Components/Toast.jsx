const Toast = ({ message, show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 9999,
        background: '#212529',
        color: '#f8f9fa',
        border: '1px solid #343a40',
        borderLeft: '4px solid #4b54ff',
        borderRadius: '10px',
        padding: '0.75rem 1.25rem',
        minWidth: '260px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        animation: 'slideIn 0.25s ease',
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>🛒</span>
      <span style={{ fontSize: '0.9rem' }}>{message}</span>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
