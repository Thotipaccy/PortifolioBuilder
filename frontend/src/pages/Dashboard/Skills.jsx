import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, ProgressBar, Badge, Row, Col } from 'react-bootstrap';
import { 
  Code2, 
  Plus, 
  Edit3, 
  Trash2, 
  Terminal, 
  Cpu, 
  Database as DbIcon, 
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
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
    <div className="skills-dashboard animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 className="fw-bold mb-1">Technical Skills</h3>
          <p className="text-muted small mb-0">Define and manage your expertise level across technologies</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm" 
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <Plus size={20} />
          <span>Add Skill</span>
        </Button>
      </div>

      {error && <Alert variant="danger" className="d-flex align-items-center gap-2 border-0 shadow-sm mb-4" onClose={() => setError(null)} dismissible><AlertCircle size={18} /> {error}</Alert>}

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {skills.length === 0 ? (
            <div className="text-center py-5 my-5">
              <Terminal size={48} className="text-light mb-3" />
              <h5 className="text-muted">No expertise records</h5>
              <p className="text-muted small">Add your technical and soft skills to build your profile</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle custom-table">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold">Skill Name</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Domain</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold" style={{ width: '35%' }}>Proficiency</th>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id} className="transition-all">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark d-flex align-items-center gap-2">
                        <Terminal size={14} className="text-primary" />
                        {skill.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg="light" text="dark" className="border fw-medium px-2 py-1" style={{ fontSize: '11px' }}>
                        {skill.category}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="flex-grow-1">
                          <ProgressBar 
                            now={skill.proficiency} 
                            variant={skill.proficiency > 75 ? 'success' : skill.proficiency > 40 ? 'primary' : 'warning'} 
                            style={{ height: '6px' }}
                            className="rounded-pill"
                          />
                        </div>
                        <span className="small fw-bold text-secondary" style={{ minWidth: '35px' }}>{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-primary" 
                          onClick={() => handleEdit(skill)}
                          title="Edit expertise"
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-danger" 
                          onClick={() => handleDelete(skill.id)}
                          title="Remove expertise"
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
            <div className={`p-2 rounded-3 ${editingSkill ? 'bg-primary-light text-primary' : 'bg-success-light text-success'}`}>
              <Code2 size={20} />
            </div>
            <Modal.Title className="fw-bold">{editingSkill ? 'Refine Expertise' : 'Record Skill'}</Modal.Title>
          </div>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pb-4">
            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-secondary mb-2">Technology or Skill Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. TypeScript, UI Design, AWS"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="py-2 px-3 border-0 shadow-sm bg-light rounded-3"
              />
            </Form.Group>
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Category</Form.Label>
                  <Form.Select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="py-2 px-3 border-0 shadow-sm bg-light rounded-3"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="small fw-semibold text-secondary mb-0">Proficiency Level</Form.Label>
                <Badge bg="primary-light" className="text-primary px-2 py-1">{formData.proficiency}%</Badge>
              </div>
              <Form.Range 
                min="0" 
                max="100" 
                value={formData.proficiency} 
                onChange={e => setFormData({...formData, proficiency: e.target.value})} 
                className="custom-range"
              />
              <div className="d-flex justify-content-between mt-1 px-1">
                <span className="text-muted" style={{ fontSize: '10px' }}>Beginner</span>
                <span className="text-muted" style={{ fontSize: '10px' }}>Expert</span>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4 pt-0">
            <Button variant="light" className="px-4 py-2 rounded-3 text-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" type="submit" className="px-5 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2">
              <CheckCircle2 size={18} />
              Save Expertise
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Skills;
