import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import api from '../../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 80
  });

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills', 'Other'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill.id}`, formData);
      } else {
        await api.post('/skills', formData);
      }
      setShowModal(false);
      resetForm();
      fetchSkills();
    } catch {
      setError('Error saving skill');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'Frontend', proficiency: 80 });
    setEditingSkill(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await api.delete(`/skills/${id}`);
        fetchSkills();
      } catch {
        setError('Error deleting skill');
      }
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category || 'Frontend',
      proficiency: skill.proficiency || 80
    });
    setShowModal(true);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Skills Showcase</h3>
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
          Add New Skill
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          {skills.length === 0 ? (
            <p className="text-center text-muted my-4">No skills added yet.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Proficiency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td>{skill.name}</td>
                    <td><span className="badge bg-info text-dark">{skill.category}</span></td>
                    <td style={{ width: '30%' }}>
                      <ProgressBar now={skill.proficiency} label={`${skill.proficiency}%`} variant="success" />
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(skill)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(skill.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. React" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Proficiency ({formData.proficiency}%)</Form.Label>
              <Form.Range 
                min="0" 
                max="100" 
                value={formData.proficiency} 
                onChange={e => setFormData({...formData, proficiency: e.target.value})} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" type="submit">Save Skill</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Skills;
