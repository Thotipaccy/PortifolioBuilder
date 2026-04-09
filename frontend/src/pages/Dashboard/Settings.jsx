import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Trash2, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  ShieldAlert,
  Save
} from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram } from '../../components/SocialIcons';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = ({ onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImg: '',
    bio: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedInUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    username: ''
  });
  const [usernameStatus, setUsernameStatus] = useState({ available: true, checking: false, suggestions: [] });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setFormData({
        name: data.name || '',
        email: data.email || '',
        profileImg: data.profileImg || '',
        bio: data.bio || '',
        title: data.title || '',
        contactDescription: data.contactDescription || '', // New field
        phone: data.phone || '',
        location: data.location || '',
        githubUrl: data.githubUrl || '',
        linkedInUrl: data.linkedInUrl || '',
        twitterUrl: data.twitterUrl || '',
        instagramUrl: data.instagramUrl || '',
        username: data.portfolio?.username || ''
      });
      setOriginalUsername(data.portfolio?.username || '');
    } catch {
      setError('Failed to load profile');
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
      setFormData(prev => ({ ...prev, profileImg: data.url }));
      toast.success('Image uploaded! Click Update to save.', { id: toastId });
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg, { id: toastId });
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const checkUsername = async (username) => {
    if (!username) {
      setUsernameStatus({ available: false, checking: false, suggestions: [] });
      return;
    }
    if (username === originalUsername) {
      setUsernameStatus({ available: true, checking: false, suggestions: [] });
      return;
    }
    
    setUsernameStatus(prev => ({ ...prev, checking: true }));
    try {
      const { data } = await api.get(`/portfolios/check-username/${username}`);
      setUsernameStatus({
        available: data.available,
        checking: false,
        suggestions: data.suggestions || []
      });
    } catch {
      setUsernameStatus(prev => ({ ...prev, checking: false }));
    }
  };

  const handleUsernameSuggestion = (name) => {
    setFormData(prev => ({ ...prev, username: name }));
    setUsernameStatus({ available: true, checking: false, suggestions: [] });
    toast.success(`Selected: ${name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameStatus.available) {
      toast.error('Please choose an available username first.');
      return;
    }
    setError(null);
    setSuccess(null);
    const toastId = toast.loading('Updating profile...');
    try {
      // Update User profile
      await api.put('/users/profile', formData);
      // Update Portfolio (username)
      await api.put('/portfolios/me', { username: formData.username });
      
      setOriginalUsername(formData.username);
      if (onUpdate) onUpdate(); // Refresh sidebar

      toast.success('Settings updated successfully!', { id: toastId });
      setSuccess('Settings updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating settings';
      toast.error(msg, { id: toastId });
      setError(msg);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center p-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light opacity-75">
      <Spinner animation="grow" variant="primary" />
      <p className="mt-3 fw-bold text-primary">Synchronizing Profile...</p>
    </div>
  );

  return (
    <div className="settings-container animate-fade-in pb-5">
      <div className="mb-5 px-1">
        <h3 className="fw-bold mb-1">Account & Profile</h3>
        <p className="text-muted small mb-0">Manage your identity, contact information, and social presence</p>
      </div>
      
      {error && <Alert variant="danger" className="d-flex align-items-center gap-2 border-0 shadow-sm mb-4" dismissible onClose={() => setError(null)}><AlertCircle size={18} /> {error}</Alert>}
      {success && <Alert variant="success" className="d-flex align-items-center gap-2 border-0 shadow-sm mb-4" dismissible onClose={() => setSuccess(null)}><CheckCircle2 size={18} /> {success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Core Identity Section */}
        <Card className="shadow-sm border-0 rounded-4 overflow-hidden mb-4">
          <Card.Header className="bg-white border-bottom p-4">
            <div className="d-flex align-items-center gap-2">
              <UserIcon className="text-primary" size={20} />
              <h5 className="mb-0 fw-bold">Personal Identity</h5>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <Row className="align-items-center mb-5">
              <Col lg={3} className="text-center text-lg-start mb-4 mb-lg-0">
                <div className="position-relative d-inline-block">
                  <img 
                    src={formData.profileImg ? formData.profileImg : "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    className="rounded-circle shadow border border-4 border-white" 
                    style={{ width: '130px', height: '130px', objectFit: 'cover' }} 
                  />
                  <label className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow-sm cursor-pointer hover-scale transition-all border border-2 border-white">
                    <Camera size={18} />
                    <input type="file" className="d-none" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                  </label>
                </div>
                {uploading && <div className="mt-2 text-primary small fw-bold">Processing image...</div>}
              </Col>
              <Col lg={9}>
                <Row>
                  <Col md={12} className="mb-4">
                    <Form.Label className="small fw-semibold text-secondary mb-2">Public Portfolio Username (URL)</Form.Label>
                    <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                      <span className="input-group-text bg-light border-0 small text-muted">/{formData.username ? '' : 'username'}</span>
                      <Form.Control 
                        type="text" 
                        value={formData.username} 
                        onChange={e => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                          setFormData({...formData, username: val});
                        }}
                        onBlur={e => checkUsername(e.target.value)}
                        placeholder="your-unique-handle"
                        className={`py-2 px-3 border-0 bg-light ${!usernameStatus.available ? 'is-invalid' : ''}`}
                      />
                      {usernameStatus.checking && <span className="input-group-text bg-light border-0"><Spinner animation="border" size="sm" /></span>}
                      {!usernameStatus.checking && usernameStatus.available && formData.username && (
                        <span className="input-group-text bg-light border-0 text-success"><CheckCircle2 size={18} /></span>
                      )}
                    </div>
                    {!usernameStatus.available && (
                      <div className="mt-3 ps-1">
                        <p className="text-danger extra-small fw-bold mb-2">This handle is already claimed. Recommendations:</p>
                        <div className="d-flex flex-wrap gap-2">
                          {usernameStatus.suggestions.map(s => (
                            <Badge 
                              key={s} 
                              bg="primary-light" 
                              className="text-primary border cursor-pointer hover-bg-primary hover-text-white transition-all py-2 px-3"
                              onClick={() => handleUsernameSuggestion(s)}
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Form.Text className="text-muted extra-small">Your portfolio will be available at: <strong>{window.location.origin}/{formData.username || '...'}</strong></Form.Text>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-secondary mb-2">Full Display Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="John Doe"
                        className="py-2 px-3 border-0 bg-light shadow-sm rounded-3"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-secondary mb-2">Email (Account ID)</Form.Label>
                      <div className="input-group overflow-hidden rounded-3 shadow-sm border-0 opacity-75">
                        <span className="input-group-text bg-light border-0"><Mail size={16} className="text-muted" /></span>
                        <Form.Control 
                          type="email" 
                          disabled 
                          value={formData.email} 
                          className="py-2 px-3 border-0 bg-light"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-secondary mb-2">Professional Summary (Hero Headline)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Full-Stack Developer | UX Enthusiast | Cloud Architect" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="py-2 px-3 border-0 bg-light shadow-sm rounded-3 font-monospace"
                style={{ fontSize: '14px' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-secondary mb-2">Elevator Pitch (Short Bio)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Briefly describe your passion, expertise, and what drives you..." 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className="py-2 px-3 border-0 bg-light shadow-sm rounded-3"
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Contact & Location Section */}
        <Card className="shadow-sm border-0 rounded-4 overflow-hidden mb-4">
          <Card.Header className="bg-white border-bottom p-4">
            <div className="d-flex align-items-center gap-2">
              <Globe className="text-primary" size={20} />
              <h5 className="mb-0 fw-bold">Contact & Location</h5>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <Row>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">Phone Number</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Phone size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="+1 (234) 567 890" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light text-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">Primary Location</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><MapPin size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. San Francisco, CA" 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light text-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-0">
              <Form.Label className="small fw-semibold text-secondary mb-2">Contact Call-to-Action Text</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                placeholder="I'm open to freelance opportunities and full-time roles in Fintech..." 
                value={formData.contactDescription} 
                onChange={e => setFormData({...formData, contactDescription: e.target.value})} 
                className="py-2 px-3 border-0 bg-light shadow-sm rounded-3 text-secondary"
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Social Presence Section */}
        <Card className="shadow-sm border-0 rounded-4 overflow-hidden mb-5">
          <Card.Header className="bg-white border-bottom p-4">
            <div className="d-flex align-items-center gap-2">
              <LinkIcon className="text-primary" size={20} />
              <h5 className="mb-0 fw-bold">Social Presence</h5>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <Row>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">GitHub Profile</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Github size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="url" 
                      placeholder="https://github.com/..." 
                      value={formData.githubUrl} 
                      onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light text-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">LinkedIn Profile</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Linkedin size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="url" 
                      placeholder="https://linkedin.com/in/..." 
                      value={formData.linkedInUrl} 
                      onChange={e => setFormData({...formData, linkedInUrl: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light text-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4 mb-lg-0">
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">Twitter / X</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Twitter size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="url" 
                      placeholder="https://twitter.com/..." 
                      value={formData.twitterUrl} 
                      onChange={e => setFormData({...formData, twitterUrl: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light text-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary mb-2">Instagram Portfolio</Form.Label>
                  <div className="input-group overflow-hidden rounded-3 shadow-sm border-0">
                    <span className="input-group-text bg-light border-0"><Instagram size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="url" 
                      placeholder="https://instagram.com/..." 
                      value={formData.instagramUrl} 
                      onChange={e => setFormData({...formData, instagramUrl: e.target.value})} 
                      className="py-2 px-3 border-0 bg-light text-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="bg-light border-0 p-4 d-flex justify-content-end">
            <Button variant="primary" type="submit" className="px-5 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2 fw-bold" disabled={uploading}>
              <Save size={18} />
              Commit Profile Updates
            </Button>
          </Card.Footer>
        </Card>
      </Form>

      {/* Danger Zone */}
      <Card className="shadow-sm border-0 rounded-4 overflow-hidden border-start border-4 border-danger">
        <Card.Body className="p-4 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="text-danger fw-bold d-flex align-items-center gap-2 mb-1">
              <ShieldAlert size={20} />
              Account Termination
            </h5>
            <p className="text-muted small mb-0">Permanently remove your account and all associated portfolio data.</p>
          </div>
          <Button variant="outline-danger" className="px-4 py-2 rounded-3 border-2 fw-bold d-flex align-items-center gap-2">
            <Trash2 size={18} />
            Delete Forever
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
