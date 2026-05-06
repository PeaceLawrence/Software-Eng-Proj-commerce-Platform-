import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = error?.status === 404;
  const title = is404 ? '404 — Page Not Found' : 'Something went wrong';
  const message = is404
    ? "We couldn't find the page you were looking for."
    : error?.message || 'An unexpected error occurred.';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: '#212529',
          border: '1px solid #343a40',
          borderRadius: '16px',
          padding: '3rem 2.5rem',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {is404 ? '🗺️' : '⚠️'}
        </div>

        <h1 style={{ color: '#f8f9fa', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          {title}
        </h1>

        <p style={{ color: '#adb5bd', marginBottom: '2rem', lineHeight: 1.6 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: '1px solid #495057',
              color: '#adb5bd',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#4b54ff',
              border: 'none',
              color: '#fff',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            Back to Shop
          </button>
        </div>
      </div>

      <p style={{ color: '#495057', marginTop: '2rem', fontSize: '0.8rem' }}>
        CampusCartAI &mdash; Towson University
      </p>
    </div>
  );
};

export default ErrorPage;
