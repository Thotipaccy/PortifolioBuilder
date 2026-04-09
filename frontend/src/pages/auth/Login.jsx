import React, { useState, useContext } from 'react';
import { Form, Button, Card, Container, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AtSign, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-gradient vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="animate-fade-in w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-primary-light text-primary mb-3 shadow-sm border border-white border-4">
            <LogIn size={32} />
          </div>
          <h2 className="fw-bold text-dark display-6 mb-1">Welcome Back</h2>
          <p className="text-muted small px-4">Continue your creative journey and update your professional presence today.</p>
        </div>

        <Card className="border-0 shadow-lg rounded-4 overflow-hidden bg-white">
          <Card.Body className="p-5">
            {error && (
              <Alert variant="danger" className="border-0 shadow-sm d-flex align-items-center gap-2 mb-4" dismissible onClose={() => setError(null)}>
                <AtSign size={18} />
                <span className="small fw-medium">{error}</span>
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="auth-form">
              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-secondary mb-2 ms-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Email Address</Form.Label>
                <InputGroup className="overflow-hidden rounded-3 shadow-sm border-0">
                  <InputGroup.Text className="bg-light border-0 px-3">
                    <Mail size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2 border-0 bg-light px-2"
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-secondary mb-2 ms-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Access Key</Form.Label>
                <InputGroup className="overflow-hidden rounded-3 shadow-sm border-0">
                  <InputGroup.Text className="bg-light border-0 px-3">
                    <Lock size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2 border-0 bg-light px-2"
                    required
                  />
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-5 ms-1">
                <Form.Check type="checkbox" label={<span className="small text-muted">Stay connected</span>} className="custom-checkbox" />
                <Link to="/forgot-password" title="Feature coming soon" className="small text-primary text-decoration-none fw-medium hover-underline opacity-75">Lost access?</Link>
              </div>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 fw-bold text-uppercase" 
                disabled={loading}
                style={{ letterSpacing: '1px' }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Enter My Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </Form>

            <div className="text-center mt-5 pt-2 border-top">
              <p className="mb-0 text-muted small">
                New to the platform? <Link to="/register" className="text-primary fw-bold text-decoration-none hover-underline">Create an identity</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
        
        <div className="mt-4 text-center">
          <p className="extra-small text-muted opacity-50 mb-0">© 2024 Portfolio OS. Secure, Encrypted, Private.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
