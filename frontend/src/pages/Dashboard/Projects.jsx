import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    imageUrls: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // First get the portfolio to get its ID
      const { data: portfolio } = await api.get('/portfolios/me');
      if (portfolio && portfolio.projects) {
        setProjects(portfolio.projects);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setError('Failed to load projects. Please create a portfolio first.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side check for 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large! Maximum limit is 10MB.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    const toastId = toast.loading('Uploading image...');
    try {
      const { data } = await api.post('/portfolios/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Add to the array
      setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, data.url] }));
      toast.success('Image uploaded!', { id: toastId });
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg, { id: toastId });
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        techStack: typeof formData.techStack === 'string' 
          ? formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
          : formData.techStack
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      
      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch {
      setError('Error saving project');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', imageUrls: [] });
    setEditingProject(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch {
        setError('Error deleting project');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrls: project.imageUrls || []
    });
    setShowModal(true);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Projects Configuration</h3>
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
          Add New Project
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          {projects.length === 0 ? (
            <p className="text-center text-muted my-4">No projects added yet. Add your first project to showcase your work!</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tech Stack</th>
                  <th>Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{Array.isArray(project.techStack) ? project.techStack.join(', ') : ''}</td>
                    <td>
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="me-2 text-decoration-none">GitHub</a>}
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-decoration-none">Live</a>}
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(project)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(project.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Edit Project' : 'Add New Project'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Title</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tech Stack (comma separated)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="React, Node.js, Prisma" 
                value={formData.techStack} 
                onChange={e => setFormData({...formData, techStack: e.target.value})} 
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    value={formData.githubUrl} 
                    onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Live Demo URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    value={formData.liveUrl} 
                    onChange={e => setFormData({...formData, liveUrl: e.target.value})} 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Project Images</Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {formData.imageUrls && formData.imageUrls.map((url, i) => (
                  <div key={i} className="position-relative">
                    <img src={url} alt="Project" style={{ width: '80px', height: '60px', objectFit: 'cover' }} className="rounded border" />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="position-absolute top-0 end-0 p-0" 
                      style={{ width: '20px', height: '20px', fontSize: '12px', lineHeight: '1' }}
                      onClick={() => setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== i) }))}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              <Form.Control type="file" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <Spinner animation="border" size="sm" className="mt-2 d-block" />}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" type="submit">Save Project</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
