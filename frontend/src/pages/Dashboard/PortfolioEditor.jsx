import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
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
    <Card className="shadow-sm">
      <Card.Header as="h5">Portfolio Editor</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Saved successfully!</Alert>}
        
        <Form onSubmit={handleUpdate}>
          <h6 className="mb-3">Theme Settings</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primary Color</Form.Label>
                <Form.Control type="color" value={theme.primaryColor} onChange={e => setTheme({...theme, primaryColor: e.target.value})} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Secondary Color</Form.Label>
                <Form.Control type="color" value={theme.secondaryColor} onChange={e => setTheme({...theme, secondaryColor: e.target.value})} />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          
          <h6 className="mb-3">SEO Settings</h6>
          <Form.Group className="mb-3">
            <Form.Label>Meta Title</Form.Label>
            <Form.Control type="text" value={seo.title} onChange={e => setSeo({...seo, title: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Meta Description</Form.Label>
            <Form.Control as="textarea" rows={2} value={seo.description} onChange={e => setSeo({...seo, description: e.target.value})} />
          </Form.Group>
          
          <hr />

          <h6 className="mb-3">Advanced Settings</h6>
          <Form.Group className="mb-3">
            <Form.Label>Portfolio Template</Form.Label>
            <Form.Select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}>
              <option value="">Select a template</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name} {t.isPremium ? '(Premium)' : ''}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Custom Domain</Form.Label>
            <Form.Control type="text" placeholder="e.g. janesmith.com" value={customDomain} onChange={e => setCustomDomain(e.target.value)} />
          </Form.Group>

          <Button type="submit" variant="success">
            Save Portfolio Configuration
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PortfolioEditor;
