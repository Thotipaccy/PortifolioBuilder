import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, Row, Col } from 'react-bootstrap';
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Education History</h3>
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
          Add Education
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Institution</th>
                <th>Degree</th>
                <th>Dates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {educations.map(edu => (
                <tr key={edu.id}>
                  <td>{edu.institution}</td>
                  <td>{edu.degree}</td>
                  <td>{new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { 
                      setEditingEdu(edu); 
                      setFormData({
                        institution: edu.institution,
                        degree: edu.degree,
                        fieldOfStudy: edu.fieldOfStudy || '',
                        startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
                        endDate: edu.endDate ? edu.endDate.split('T')[0] : ''
                      }); 
                      setShowModal(true); 
                    }}>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(edu.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingEdu ? 'Edit' : 'Add'} Education</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Institution</Form.Label>
              <Form.Control required type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Degree</Form.Label>
              <Form.Control required type="text" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Field of Study</Form.Label>
              <Form.Control type="text" value={formData.fieldOfStudy} onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})} />
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
                  <Form.Label>End Date (optional)</Form.Label>
                  <Form.Control type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
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

export default Education;
