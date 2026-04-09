import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="my-5">
      {/* Hero Section */}
      <Row className="align-items-center mb-5 text-center text-md-start">
        <Col md={6}>
          <h1 className="display-4 fw-bold mb-4">Build Your Perfect Portfolio in Minutes</h1>
          <p className="lead mb-4 text-muted">
            Create a professional, responsive, and dynamic portfolio website to showcase your skills and projects. No coding required.
          </p>
          <div>
            <Button as={Link} to="/register" variant="primary" size="lg" className="me-3 px-4 py-2">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="outline-secondary" size="lg" className="px-4 py-2">
              Login
            </Button>
          </div>
        </Col>
        <Col md={6} className="mt-5 mt-md-0">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" 
            alt="Portfolio Builder Preview" 
            className="img-fluid rounded shadow-lg"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </Col>
      </Row>

      {/* Features Section */}
      <h2 className="text-center mb-5 fw-bold mt-5">Features</h2>
      <Row className="g-4">
        {[
          { title: 'Custom Themes', text: 'Customize your primary colors, fonts, and dark mode to match your personal brand.' },
          { title: 'Drag & Drop Editor', text: 'Easily reorder your portfolio sections like projects, skills, and timeline.' },
          { title: 'SEO Optimized', text: 'Built-in meta tags and custom domain mapping to get you discovered on Google.' },
        ].map((feature, idx) => (
          <Col md={4} key={idx}>
            <Card className="h-100 border-0 shadow-sm text-center py-4">
              <Card.Body>
                <div className="mb-3 fs-1 text-primary">✧</div>
                <Card.Title className="fw-bold">{feature.title}</Card.Title>
                <Card.Text className="text-muted">{feature.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
