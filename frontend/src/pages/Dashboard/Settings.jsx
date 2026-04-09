import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
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

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4 fw-bold">Profile Settings</h3>
      
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Your Portfolio URL</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">http://localhost/</span>
                      <Form.Control 
                        type="text" 
                        value={formData.username} 
                        onChange={e => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                          setFormData({...formData, username: val});
                        }}
                        onBlur={e => checkUsername(e.target.value)}
                        placeholder="yourname"
                        className={!usernameStatus.available ? 'is-invalid' : ''}
                      />
                    </div>
                    {usernameStatus.checking && <Spinner animation="border" size="sm" variant="primary" />}
                    {!usernameStatus.checking && usernameStatus.available && formData.username && (
                      <span className="text-success">✅ Available</span>
                    )}
                  </div>
                  {!usernameStatus.available && (
                    <div className="mt-2">
                      <p className="text-danger small mb-2">This name is taken. Try these suggestions:</p>
                      <div className="d-flex flex-wrap gap-2">
                        {usernameStatus.suggestions.map(s => (
                          <Button 
                            key={s} 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleUsernameSuggestion(s)}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  <Form.Text className="text-muted">This will be your direct portfolio link.</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Enter your full name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    disabled 
                    value={formData.email} 
                  />
                  <Form.Text className="text-muted">Email cannot be changed.</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Professional Title (Hero Subtitle)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Software Engineering Student | Passionate Developer" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
              <Form.Text className="text-muted">This appears directly under your name on the hero section.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Contact Section Text</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                placeholder="e.g. I'm always interested in new opportunities..." 
                value={formData.contactDescription} 
                onChange={e => setFormData({...formData, contactDescription: e.target.value})} 
              />
              <Form.Text className="text-muted">This text appears under 'Let's Connect' in the contact section.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Profile Image</Form.Label>
              <div className="d-flex align-items-center gap-4 p-3 border rounded bg-light">
                <img 
                  src={formData.profileImg ? formData.profileImg : "https://via.placeholder.com/100"} 
                  alt="Profile" 
                  className="rounded-circle shadow-sm" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                />
                <div className="flex-grow-1">
                  <Form.Control 
                    type="file" 
                    onChange={handleImageUpload} 
                    disabled={uploading}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">Max size: 10MB. Recommended: Square image.</Form.Text>
                </div>
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Phone Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="+1 234 567 890" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Location</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="City, Country" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Bio / About Me</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Write a brief introduction about yourself..." 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
              />
            </Form.Group>

            <h5 className="mb-3 mt-4 fw-bold">Social Media Profiles</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-uppercase fw-bold text-muted">GitHub URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    placeholder="https://github.com/username" 
                    value={formData.githubUrl} 
                    onChange={e => setFormData({...formData, githubUrl: e.target.value})} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-uppercase fw-bold text-muted">LinkedIn URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    placeholder="https://linkedin.com/in/username" 
                    value={formData.linkedInUrl} 
                    onChange={e => setFormData({...formData, linkedInUrl: e.target.value})} 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-uppercase fw-bold text-muted">Twitter URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    placeholder="https://twitter.com/username" 
                    value={formData.twitterUrl} 
                    onChange={e => setFormData({...formData, twitterUrl: e.target.value})} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-uppercase fw-bold text-muted">Instagram URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    placeholder="https://instagram.com/username" 
                    value={formData.instagramUrl} 
                    onChange={e => setFormData({...formData, instagramUrl: e.target.value})} 
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5">
              <Button variant="primary" type="submit" size="lg" className="px-5 shadow-sm" disabled={uploading}>
                Save Profile Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 border-start border-4 border-danger">
        <Card.Body className="p-4">
          <h5 className="text-danger fw-bold">Danger Zone</h5>
          <p className="text-muted">Once you delete your account, there is no going back. All your portfolio data will be permanently removed.</p>
          <Button variant="outline-danger">Delete Account</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
