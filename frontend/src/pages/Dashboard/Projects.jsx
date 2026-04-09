import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Layers, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Code2
} from 'lucide-react';
import { Github } from '../../components/SocialIcons';
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
    <div className="projects-container animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 className="fw-bold mb-1">Projects Library</h3>
          <p className="text-muted small mb-0">Manage and showcase your best technical work</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm" 
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <Plus size={20} />
          <span>New Project</span>
        </Button>
      </div>

      {error && <Alert variant="danger" className="d-flex align-items-center gap-2 border-0 shadow-sm mb-4" onClose={() => setError(null)} dismissible><AlertCircle size={18} /> {error}</Alert>}

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {projects.length === 0 ? (
            <div className="text-center py-5 my-5">
              <Layers size={48} className="text-light mb-3" />
              <h5 className="text-muted">No projects found</h5>
              <p className="text-muted small">Start by adding your first project to your portfolio</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle custom-table">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold">Project Details</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Tech Stack</th>
                  <th className="py-3 border-0 text-uppercase small text-muted fw-bold">Status</th>
                  <th className="px-4 py-3 border-0 text-uppercase small text-muted fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="transition-all">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark">{project.title}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>{project.description}</div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex flex-wrap gap-1">
                        {Array.isArray(project.techStack) && project.techStack.map((tech, i) => (
                          <Badge key={i} bg="light" text="primary" className="fw-normal border text-primary" style={{ fontSize: '10px' }}>{tech}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex gap-3">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-secondary" title="GitHub Repo">
                            <Github size={18} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-primary" title="Live Demo">
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-primary" 
                          onClick={() => handleEdit(project)}
                          title="Edit Project"
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="p-2 rounded-3 text-danger" 
                          onClick={() => handleDelete(project.id)}
                          title="Delete Project"
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
            <div className={`p-2 rounded-3 ${editingProject ? 'bg-primary-light text-primary' : 'bg-success-light text-success'}`}>
              <Layers size={20} />
            </div>
            <Modal.Title className="fw-bold">{editingProject ? 'Refine Project' : 'New Project'}</Modal.Title>
          </div>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4">
            <Row>
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Project Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    placeholder="e.g. E-commerce Microservices Platform"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="py-2 px-3 border-0 shadow-sm bg-light rounded-3"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Detailed Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    required 
                    placeholder="Describe the problem solved, key features, and your contribution..."
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="py-2 px-3 border-0 shadow-sm bg-light rounded-3"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Tech Stack (comma separated)</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Code2 size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="React, Node.js, Prisma, AWS, Docker" 
                      value={formData.techStack} 
                      onChange={e => setFormData({...formData, techStack: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Source Code (GitHub)</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Github size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="url" 
                      placeholder="https://github.com/..."
                      value={formData.githubUrl} 
                      onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary mb-2">Live Deployment</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><ExternalLink size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="url" 
                      placeholder="https://demo.com"
                      value={formData.liveUrl} 
                      onChange={e => setFormData({...formData, liveUrl: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-semibold text-secondary mb-2">Project Imagery</Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {formData.imageUrls && formData.imageUrls.map((url, i) => (
                  <div key={i} className="position-relative group shadow-sm rounded-3 overflow-hidden" style={{ width: '100px', height: '75px' }}>
                    <img src={url} alt="Project" className="w-100 h-100 object-fit-cover" />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="position-absolute top-0 end-0 m-1 p-0 rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ width: '22px', height: '22px', fontSize: '12px' }}
                      onClick={() => setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== i) }))}
                    >
                      <XCircle size={14} />
                    </Button>
                  </div>
                ))}
                <label className="d-flex flex-column align-items-center justify-content-center border-2 border-dashed rounded-3 text-muted hover-bg-light cursor-pointer transition-all" style={{ width: '100px', height: '75px' }}>
                  <ImageIcon size={20} className="mb-1" />
                  <span style={{ fontSize: '10px' }}>Upload</span>
                  <input type="file" className="d-none" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {uploading && (
                <div className="d-flex align-items-center gap-2 text-primary small">
                  <Spinner animation="border" size="sm" />
                  <span>Processing high-quality upload...</span>
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4 pt-0">
            <Button variant="light" className="px-4 py-2 rounded-3 text-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" type="submit" className="px-5 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2">
              <CheckCircle2 size={18} />
              Save Project
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
