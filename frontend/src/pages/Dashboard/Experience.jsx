import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, Row, Col } from 'react-bootstrap';
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Work Experience</h3>
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
          Add Experience
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Dates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.company}</td>
                  <td>{exp.position}</td>
                  <td>{new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { setEditingExp(exp); setFormData({
                      company: exp.company,
                      position: exp.position,
                      description: exp.description || '',
                      startDate: exp.startDate.split('T')[0],
                      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
                      location: exp.location || ''
                    }); setShowModal(true); }}>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(exp.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingExp ? 'Edit' : 'Add'} Experience</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Control required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date (leave blank if current)</Form.Label>
                  <Form.Control type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Experience;
