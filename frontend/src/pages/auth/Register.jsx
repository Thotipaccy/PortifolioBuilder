import React, { useState, useContext } from 'react';
import { Form, Button, Card, Container, Alert, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { register, error, loading, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await register(name, email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-gradient vh-100 d-flex align-items-center justify-content-center p-3 overflow-auto py-5">
      <div className="animate-fade-in w-100 py-4" style={{ maxWidth: '550px' }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-success-light text-success mb-3 shadow-sm border border-white border-4">
            <UserPlus size={32} />
          </div>
          <h2 className="fw-bold text-dark display-6 mb-1">Create Your Identity</h2>
          <p className="text-muted small px-5">Join our community of creators and build a portfolio that stands out in the digital landscape.</p>
        </div>

        <Card className="border-0 shadow-lg rounded-4 overflow-hidden bg-white">
          <Card.Body className="p-5">
            {error && (
              <Alert variant="danger" className="border-0 shadow-sm d-flex align-items-center gap-2 mb-4" dismissible onClose={() => setError(null)}>
                <ShieldCheck size={18} />
                <span className="small fw-medium">{error}</span>
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="auth-form">
              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-secondary mb-2 ms-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Full Name</Form.Label>
                <InputGroup className="overflow-hidden rounded-3 shadow-sm border-0">
                  <InputGroup.Text className="bg-light border-0 px-3">
                    <User size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. Alex Rivera" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="py-2 border-0 bg-light px-2"
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-secondary mb-2 ms-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Email Address</Form.Label>
                <InputGroup className="overflow-hidden rounded-3 shadow-sm border-0">
                  <InputGroup.Text className="bg-light border-0 px-3">
                    <Mail size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    type="email" 
                    placeholder="name@personal.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2 border-0 bg-light px-2"
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-semibold text-secondary mb-2 ms-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Password</Form.Label>
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
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-semibold text-secondary mb-2 ms-1 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Verify</Form.Label>
                    <InputGroup className="overflow-hidden rounded-3 shadow-sm border-0">
                      <InputGroup.Text className="bg-light border-0 px-3">
                        <ShieldCheck size={18} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control 
                        type="password" 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="py-2 border-0 bg-light px-2"
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-4 ms-1">
                <Form.Check 
                  type="checkbox" 
                  required
                  label={<span className="small text-muted">I agree to the <Link to="/terms" className="text-primary text-decoration-none">Privacy Policy</Link> and data handling.</span>} 
                  className="custom-checkbox" 
                />
              </div>

              <Button 
                variant="success" 
                type="submit" 
                className="w-100 py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 fw-bold text-uppercase" 
                disabled={loading}
                style={{ letterSpacing: '1px' }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Launching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Begin Registration</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </Form>

            <div className="text-center mt-5 pt-3 border-top">
              <p className="mb-0 text-muted small text-center w-100" style={{ opacity: 0.8 }}>
                Already part of the network? <Link to="/login" className="text-success fw-bold text-decoration-none hover-underline">Sign in to workspace</Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        <div className="mt-5 d-flex justify-content-center gap-4">
          <div className="d-flex align-items-center gap-2 text-muted opacity-50 extra-small">
            <CheckCircle2 size={12} />
            Secure Session
          </div>
          <div className="d-flex align-items-center gap-2 text-muted opacity-50 extra-small">
            <CheckCircle2 size={12} />
            Cloud Backup
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
