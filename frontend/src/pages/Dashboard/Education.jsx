import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  BookOpen, 
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/education');
      setEducations(data);
    } catch (error) {
      if (error.response?.status !== 404) {
        setError('Failed to load education records');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEdu) {
        await api.put(`/education/${editingEdu.id}`, formData);
      } else {
        await api.post('/education', formData);
      }
      setShowModal(false);
      resetForm();
      fetchEducations();
    } catch {
      setError('Error saving education');
    }
  };

  const resetForm = () => {
    setFormData({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });
    setEditingEdu(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/education/${id}`);
        fetchEducations();
      } catch {
        setError('Error deleting');
      }
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="education-dashboard animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 className="fw-bold mb-1">Academic Background</h3>
          <p className="text-muted small mb-0">Record your degrees, certifications, and educational milestones</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm" 
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <Plus size={20} />
          <span>Add Education</span>
        </Button>
      </div>

      {error && <Alert variant="danger" className="d-flex align-items-center gap-2 border-0 shadow-sm mb-4" onClose={() => setError(null)} dismissible><AlertCircle size={18} /> {error}</Alert>}

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {educations.length === 0 ? (
            <div className="text-center py-5 my-5">
              <GraduationCap size={48} className="text-light mb-3" />
              <h5 className="text-muted">No academic records</h5>
              <p className="text-muted small">Add your university or online course certifications here</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle custom-table">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold">Institution & Degree</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Period</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Field of Study</th>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {educations.map((edu) => (
                  <tr key={edu.id} className="transition-all">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark d-flex align-items-center gap-2">
                        <Building size={14} className="text-primary" />
                        {edu.institution}
                      </div>
                      <div className="text-secondary small">{edu.degree}</div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2 small text-secondary fw-medium">
                        <Calendar size={14} className="text-muted" />
                        <span>
                          {new Date(edu.startDate).getFullYear()}
                          {' - '}
                          {edu.endDate ? new Date(edu.endDate).getFullYear() : <Badge bg="success-light" text="success" className="fw-medium border-success border opacity-75">Present</Badge>}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {edu.fieldOfStudy && (
                        <Badge bg="light" text="primary" className="border fw-normal px-2 py-1" style={{ fontSize: '11px' }}>
                          {edu.fieldOfStudy}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-primary" 
                          onClick={() => { 
                            setEditingEdu(edu); 
                            setFormData({
                              institution: edu.institution,
                              degree: edu.degree,
                              fieldOfStudy: edu.fieldOfStudy || '',
                              startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
                              endDate: edu.endDate ? edu.endDate.split('T')[0] : ''
                            }); 
                            setShowModal(true); 
                          }}
                          title="Edit degree"
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-danger" 
                          onClick={() => handleDelete(edu.id)}
                          title="Remove degree"
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

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} centered className="premium-modal">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <div className="d-flex align-items-center gap-2">
            <div className={`p-2 rounded-3 ${editingEdu ? 'bg-primary-light text-primary' : 'bg-success-light text-success'}`}>
              <GraduationCap size={20} />
            </div>
            <Modal.Title className="fw-bold">{editingEdu ? 'Refine Education' : 'Academic Entry'}</Modal.Title>
          </div>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4">
            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-secondary mb-2">Institution / University</Form.Label>
              <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                <span className="input-group-text bg-light border-0"><Building size={16} className="text-muted" /></span>
                <Form.Control 
                  type="text" 
                  required 
                  placeholder="e.g. Stanford University, MIT"
                  value={formData.institution} 
                  onChange={e => setFormData({...formData, institution: e.target.value})} 
                  className="py-2 px-3 border-0 bg-light"
                />
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Degree / Qualification</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><GraduationCap size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      required 
                      placeholder="e.g. Bachelor of Science"
                      value={formData.degree} 
                      onChange={e => setFormData({...formData, degree: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Field of Study</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><BookOpen size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. Computer Science"
                      value={formData.fieldOfStudy} 
                      onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
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
              <Col md={6}>
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
            </Row>
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

export default Education;
