import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { 
  Award, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react';
import api from '../../services/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    location: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/experience');
      setExperiences(data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load experience records. Please create a portfolio first.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await api.put(`/experience/${editingExp.id}`, formData);
      } else {
        await api.post('/experience', formData);
      }
      setShowModal(false);
      resetForm();
      fetchExperiences();
    } catch {
      setError('Error saving experience');
    }
  };

  const resetForm = () => {
    setFormData({ company: '', position: '', description: '', startDate: '', endDate: '', location: '' });
    setEditingExp(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/experience/${id}`);
        fetchExperiences();
      } catch {
        setError('Error deleting');
      }
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="experience-dashboard animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 className="fw-bold mb-1">Career Journey</h3>
          <p className="text-muted small mb-0">Chronicle your professional work history and achievements</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm" 
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <Plus size={20} />
          <span>New Experience</span>
        </Button>
      </div>

      {error && <Alert variant="danger" className="d-flex align-items-center gap-2 border-0 shadow-sm mb-4" onClose={() => setError(null)} dismissible><AlertCircle size={18} /> {error}</Alert>}

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {experiences.length === 0 ? (
            <div className="text-center py-5 my-5">
              <Award size={48} className="text-light mb-3" />
              <h5 className="text-muted">Empty timeline</h5>
              <p className="text-muted small">Add your past or current roles to showcase your career growth</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle custom-table">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold">Role & Company</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Period</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Location</th>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp.id} className="transition-all">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark">{exp.position}</div>
                      <div className="text-primary small d-flex align-items-center gap-1">
                        <Building2 size={12} />
                        {exp.company}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2 small text-secondary">
                        <Calendar size={14} className="text-muted" />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                          {' - '}
                          {exp.endDate 
                            ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                            : <Badge bg="success-light" text="success" className="fw-medium border-success border opacity-75">Present</Badge>
                          }
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {exp.location && (
                        <div className="d-flex align-items-center gap-1 small text-muted">
                          <MapPin size={14} />
                          {exp.location}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-primary" 
                          onClick={() => { setEditingExp(exp); setFormData({
                            company: exp.company,
                            position: exp.position,
                            description: exp.description || '',
                            startDate: exp.startDate.split('T')[0],
                            endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
                            location: exp.location || ''
                          }); setShowModal(true); }}
                          title="Edit timeline"
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-danger" 
                          onClick={() => handleDelete(exp.id)}
                          title="Remove entry"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg" centered className="premium-modal">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <div className="d-flex align-items-center gap-2">
            <div className={`p-2 rounded-3 ${editingExp ? 'bg-primary-light text-primary' : 'bg-success-light text-success'}`}>
              <Briefcase size={20} />
            </div>
            <Modal.Title className="fw-bold">{editingExp ? 'Refine Experience' : 'Role Entry'}</Modal.Title>
          </div>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Company / Organization</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Building2 size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      required 
                      placeholder="e.g. Google, Remote Startups"
                      value={formData.company} 
                      onChange={e => setFormData({...formData, company: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Job Title / Role</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Award size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      required 
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.position} 
                      onChange={e => setFormData({...formData, position: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">Start Date</Form.Label>
                  <Form.Control 
                    required 
                    type="date" 
                    value={formData.startDate} 
                    onChange={e => setFormData({...formData, startDate: e.target.value})} 
                    className="py-2 px-3 border-0 shadow-sm bg-light rounded-3"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">End Date (or blank)</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={formData.endDate} 
                    onChange={e => setFormData({...formData, endDate: e.target.value})} 
                    className="py-2 px-3 border-0 shadow-sm bg-light rounded-3"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">Location</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><MapPin size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. London, Remote"
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-secondary mb-2">Core Responsibilities & Impact</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Managed scaling for millions of users, optimized internal tooling..."
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="py-2 px-3 border-0 shadow-sm bg-light rounded-3"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4 pt-0">
            <Button variant="light" className="px-4 py-2 rounded-3 text-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" type="submit" className="px-5 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2">
              <CheckCircle2 size={18} />
              Save Record
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Experience;
