import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💥</div>

          <h1 style={{ color: '#f8f9fa', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            The app ran into a problem
          </h1>

          <p style={{ color: '#adb5bd', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Something crashed unexpectedly. Your cart and data are safe — try reloading the page.
          </p>

          {this.state.error && (
            <details
              style={{
                background: '#2c3136',
                border: '1px solid #495057',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <summary style={{ color: '#6c757d', fontSize: '0.8rem', userSelect: 'none' }}>
                Error details
              </summary>
              <pre
                style={{
                  color: '#ff6b6b',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.message}
              </pre>
            </details>
          )}

          <button
            onClick={this.handleReset}
            style={{
              background: '#4b54ff',
              border: 'none',
              color: '#fff',
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              width: '100%',
            }}
          >
            Reload App
          </button>
        </div>

        <p style={{ color: '#495057', marginTop: '2rem', fontSize: '0.8rem' }}>
          CampusCartAI &mdash; Towson University
        </p>
      </div>
    );
  }
}

export default ErrorBoundary;
