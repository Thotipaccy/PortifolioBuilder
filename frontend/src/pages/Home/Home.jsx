import React from 'react';
import { Container, Row, Col, Button, Card, Badge, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layout, 
  Palette, 
  Zap, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Layers,
  Monitor,
  Search
} from 'lucide-react';
import { Github } from '../../components/SocialIcons';

const Home = () => {
  return (
    <div className="landing-page-wrapper">
      {/* Premium Navbar */}
      <Navbar bg="white" expand="lg" className="py-3 sticky-top shadow-sm border-bottom">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2 text-primary">
            <div className="bg-primary text-white p-2 rounded-3 shadow-sm">
              <Layers size={22} />
            </div>
            <span className="fs-4 tracking-tight">Portfolio<span className="text-dark">OS</span></span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-3">
              <Nav.Link href="#features" className="fw-medium text-dark opacity-75 hover-opacity-100">Features</Nav.Link>
              <Nav.Link href="#showcase" className="fw-medium text-dark opacity-75 hover-opacity-100">Showcase</Nav.Link>
              <Nav.Link href="#faq" className="fw-medium text-dark opacity-75 hover-opacity-100">FAQ</Nav.Link>
            </Nav>
            <div className="d-flex gap-2">
              <Button as={Link} to="/login" variant="light" className="px-4 py-2 fw-bold text-dark border-0">Sign In</Button>
              <Button as={Link} to="/register" variant="primary" className="px-4 py-2 fw-bold shadow-sm rounded-3">Get Started</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="hero-section py-5 py-md-10 position-relative overflow-hidden bg-white">
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, var(--bs-primary) 0%, transparent 70%)', zIndex: 0 }}></div>
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <Row className="align-items-center mb-5 text-center text-lg-start pt-5">
            <Col lg={6} className="pe-lg-5">
              <Badge bg="primary-light" text="primary" className="px-3 py-2 rounded-pill fw-bold mb-4 d-inline-flex align-items-center gap-2 animate-bounce-in">
                <Sparkles size={14} />
                <span>The Web's Most Advanced Portfolio Builder</span>
              </Badge>
              <h1 className="display-3 fw-bold mb-4 tracking-tight lh-sm text-dark">
                Elevate Your <span className="text-gradient">Digital Presence</span> In Minutes.
              </h1>
              <p className="lead mb-5 text-muted fw-medium lh-base">
                Create a stunning, industry-standard portfolio with our AI-assisted builder. Professional themes, real-time analytics, and SEO-ready deployment out of the box.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button as={Link} to="/register" variant="primary" size="lg" className="px-5 py-3 rounded-4 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2">
                  <span>Start Building Free</span>
                  <ChevronRight size={20} />
                </Button>
                <Button as={Link} to="/showcase" variant="outline-dark" size="lg" className="px-5 py-3 rounded-4 fw-bold border-2 d-flex align-items-center justify-content-center gap-2">
                  <Monitor size={20} />
                  <span>View Examples</span>
                </Button>
              </div>
              <div className="mt-5 d-flex align-items-center gap-4 text-muted extra-small fw-bold text-uppercase tracking-wider opacity-50">
                <div className="d-flex align-items-center gap-2"><ShieldCheck size={16} /> No Credit Card Required</div>
                <div className="d-flex align-items-center gap-2"><Globe size={16} /> Custom Domain Mapping</div>
              </div>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <div className="position-relative p-2 p-md-3 bg-light rounded-5 shadow-2xl animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Editor Dashboard Preview" 
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ border: '1px solid rgba(0,0,0,0.05)' }}
                />
                <div className="position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-4 shadow-lg border d-none d-md-block" style={{ maxWidth: '200px' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="p-1 bg-success-light text-success rounded-circle"><Zap size={14} /></div>
                    <span className="small fw-bold">100% SEO Score</span>
                  </div>
                  <div className="extra-small text-muted">Optimized for Google search discoverability.</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trust Section */}
      <section className="bg-light py-5">
        <Container>
          <p className="text-center extra-small fw-bold text-muted text-uppercase tracking-widest mb-4 opacity-50">Empowering Developers Globally</p>
          <div className="d-flex flex-wrap justify-content-center gap-5 opacity-40 grayscale transition-all cursor-default">
            <div className="d-flex align-items-center gap-2 fs-4 fw-bold font-monospace">GITHUB</div>
            <div className="d-flex align-items-center gap-2 fs-4 fw-bold font-monospace">VERCEL</div>
            <div className="d-flex align-items-center gap-2 fs-4 fw-bold font-monospace">STRIPE</div>
            <div className="d-flex align-items-center gap-2 fs-4 fw-bold font-monospace">PRISMA</div>
            <div className="d-flex align-items-center gap-2 fs-4 fw-bold font-monospace">DOCKER</div>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-10 bg-white">
        <Container>
          <div className="text-center mb-10 max-w-700 mx-auto">
            <Badge bg="success-light" text="success" className="px-3 py-2 rounded-pill fw-bold mb-3 uppercase tracking-wider">Engineered for Excellence</Badge>
            <h2 className="display-5 fw-bold mb-4 text-dark">Why choose Portfolio OS?</h2>
            <p className="lead text-muted">We combine enterprise-grade performance with boutique design sensibilities.</p>
          </div>
          <Row className="g-4">
            {[
              { 
                title: 'Bespoke Themes', 
                text: 'Tailor every pixel. Select from curated color palettes and premium typography systems.', 
                icon: Palette, 
                color: 'primary' 
              },
              { 
                title: 'Smart Editor', 
                text: 'Intelligent section management. Drag, drop, and refine your narrative with zero friction.', 
                icon: Layout, 
                color: 'success' 
              },
              { 
                title: 'Performance First', 
                text: 'Lightning fast load times. Built on modern tech to ensure your visitors stay engaged.', 
                icon: Zap, 
                color: 'warning' 
              },
              { 
                title: 'SEO Autopilot', 
                text: 'Automated meta-tag generation and sitemap management for maximum visibility.', 
                icon: Search, 
                color: 'info' 
              },
              { 
                title: 'Open Source Spirit', 
                text: 'Connect your GitHub and showcase your contribution streaks in real-time.', 
                icon: Github, 
                color: 'dark' 
              },
              { 
                title: 'Global Hosting', 
                text: 'Deployed across edge networks globally for sub-second latency from anywhere.', 
                icon: Globe, 
                color: 'danger' 
              },
            ].map((feature, idx) => (
              <Col lg={4} md={6} key={idx}>
                <Card className="h-100 border-0 shadow-sm rounded-4 p-4 transition-all hover-translate-y hover-shadow-lg">
                  <Card.Body>
                    <div className={`p-3 rounded-4 bg-${feature.color}-light text-${feature.color} d-inline-block mb-4`}>
                      <feature.icon size={28} />
                    </div>
                    <Card.Title className="fw-bold fs-4 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted lh-base">{feature.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Footer Section */}
      <section className="py-10">
        <Container>
          <div className="bg-dark text-white rounded-5 p-5 p-md-10 text-center shadow-3xl position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, var(--bs-primary) 0%, transparent 50%)' }}></div>
            <div className="position-relative z-1">
              <h2 className="display-4 fw-bold mb-4">Ready to launch your brand?</h2>
              <p className="lead mb-5 opacity-75 max-w-600 mx-auto">Join over 10,000 developers who have transformed their careers with a professional portfolio.</p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button as={Link} to="/register" variant="primary" size="lg" className="px-5 py-3 rounded-4 fw-bold shadow-lg">
                  Get Started For Free
                </Button>
                <Button as={Link} to="/documentation" variant="outline-light" size="lg" className="px-5 py-3 rounded-4 fw-bold border-2">
                  Read Documentation
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Simple Footer */}
      <footer className="py-5 bg-white border-top">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <span className="text-muted small">© 2024 Portfolio OS. All rights reserved. Crafted for the modern web.</span>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-4 text-muted small">
                <Link to="/privacy" className="text-decoration-none text-muted hover-text-primary">Privacy</Link>
                <Link to="/terms" className="text-decoration-none text-muted hover-text-primary">Terms</Link>
                <Link to="/docs" className="text-decoration-none text-muted hover-text-primary">Docs</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
