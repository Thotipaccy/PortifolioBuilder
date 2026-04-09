import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Palette, Globe, Search, Save, Layout, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const PortfolioEditor = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [theme, setTheme] = useState({ primaryColor: '#000000', secondaryColor: '#ffffff', font: 'Inter', darkMode: false });
  const [seo, setSeo] = useState({ title: '', description: '', keywords: '' });
  const [customDomain, setCustomDomain] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    fetchPortfolio();
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/templates');
      setTemplates(data);
    } catch {
      console.error('Failed to fetch templates');
    }
  };

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get('/portfolios/me');
      setPortfolio(data);
      setTheme({
        primaryColor: data.primaryColor || '#000000',
        secondaryColor: data.secondaryColor || '#ffffff',
        font: data.font || 'Inter',
        darkMode: data.darkMode || false
      });
      setSeo({
        title: data.seoTitle || '',
        description: data.seoDescription || '',
        keywords: data.seoKeywords || ''
      });
      setCustomDomain(data.customDomain || '');
      setSelectedTemplate(data.templateId || '');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setPortfolio(null); // Needs to create one
      } else {
        setError('Failed to fetch portfolio data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      if (!portfolio) {
        // Create it
        const { data } = await api.post('/portfolios', { username: 'default_user' + Date.now(), templateId: 'default-template' });
        setPortfolio(data);
      } else {
        // Update it
        await api.put('/portfolios/me', {
          theme,
          seoTitle: seo.title,
          seoDescription: seo.description,
          seoKeywords: seo.keywords,
          customDomain,
          templateId: selectedTemplate
        });
      }
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating portfolio');
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white py-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <Layout size={24} className="text-primary" />
          <h5 className="mb-0 fw-bold">Portfolio Editor</h5>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {error && <Alert variant="danger" className="d-flex align-items-center gap-2 border-0 shadow-sm"><ShieldCheck size={18} /> {error}</Alert>}
        {success && <Alert variant="success" className="d-flex align-items-center gap-2 border-0 shadow-sm"><ShieldCheck size={18} /> Saved successfully!</Alert>}
        
        <Form onSubmit={handleUpdate}>
          {/* Theme Settings Section */}
          <div className="settings-section mb-4 p-4 border rounded-4 bg-light shadow-sm">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Palette className="text-primary" size={22} />
              <h6 className="mb-0 fw-bold fs-5">Theme Settings</h6>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Primary Accent Color</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control 
                      type="color" 
                      className="form-control-color"
                      value={theme.primaryColor} 
                      onChange={e => setTheme({...theme, primaryColor: e.target.value})} 
                      style={{ width: '60px', padding: '0', height: '60px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                    />
                    <div>
                      <div className="fw-bold">{theme.primaryColor.toUpperCase()}</div>
                      <div className="small text-muted">Used for headers and links</div>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Secondary Accent Color</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control 
                      type="color" 
                      className="form-control-color"
                      value={theme.secondaryColor} 
                      onChange={e => setTheme({...theme, secondaryColor: e.target.value})} 
                      style={{ width: '60px', padding: '0', height: '60px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                    />
                    <div>
                      <div className="fw-bold">{theme.secondaryColor.toUpperCase()}</div>
                      <div className="small text-muted">Used for buttons and highlights</div>
                    </div>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* SEO Settings Section */}
          <div className="settings-section mb-4 p-4 border rounded-4 bg-light shadow-sm">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Search className="text-primary" size={22} />
              <h6 className="mb-0 fw-bold fs-5">SEO & Metadata</h6>
            </div>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-secondary mb-2">Portfolio Meta Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter page title for search engines"
                value={seo.title} 
                onChange={e => setSeo({...seo, title: e.target.value})} 
                className="py-2 px-3 border-0 shadow-sm rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label className="small fw-semibold text-secondary mb-2">Portfolio Meta Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Brief description of your portfolio for search results"
                value={seo.description} 
                onChange={e => setSeo({...seo, description: e.target.value})} 
                className="py-2 px-3 border-0 shadow-sm rounded-3"
              />
            </Form.Group>
          </div>

          {/* Advanced Settings Section */}
          <div className="settings-section mb-5 p-4 border rounded-4 bg-light shadow-sm">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Globe className="text-primary" size={22} />
              <h6 className="mb-0 fw-bold fs-5">Advanced Settings</h6>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Active Template</Form.Label>
                  <Form.Select 
                    value={selectedTemplate} 
                    onChange={e => setSelectedTemplate(e.target.value)}
                    className="py-2 px-3 border-0 shadow-sm rounded-3"
                  >
                    <option value="">Select a template</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} {t.isPremium ? '(Premium)' : ''}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Custom Domain Mapping</Form.Label>
                  <div className="input-group shadow-sm rounded-3 overflow-hidden">
                    <span className="input-group-text bg-white border-0"><Globe size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. thoti.com" 
                      value={customDomain} 
                      onChange={e => setCustomDomain(e.target.value)} 
                      className="py-2 px-3 border-0"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="d-grid">
            <Button type="submit" variant="primary" size="lg" className="d-flex align-items-center justify-content-center gap-2 rounded-3 shadow py-3 fw-bold transition-all">
              <Save size={22} />
              Save Portfolio Configuration
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PortfolioEditor;
