import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Send, 
  Moon, 
  Sun, 
  Menu, 
  X,
  ChevronRight,
  User,
  Award,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram } from '../../components/SocialIcons';
import api from '../../services/api';
import './PublicPortfolio.css';

const PublicPortfolio = () => {
    const { username } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [formStatus, setFormStatus] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/portfolios/${username}`);
                setData(response.data);
                if (response.data.user?.name) {
                    document.title = `${response.data.user.name} | Professional Portfolio`;
                }
                if (response.data.darkMode) {
                    setIsDarkMode(true);
                }
            } catch (err) {
                console.error('Error fetching portfolio:', err);
                setError(err.response?.data?.message || 'Portfolio not found');
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, [username]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');
        try {
            await api.post(`/portfolios/${username}/contact`, formData);
            setFormStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setFormStatus(''), 5000);
        } catch {
            setFormStatus('error');
            setTimeout(() => setFormStatus(''), 5000);
        }
    };

    if (loading) {
        return (
            <div className="portfolio-container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="d-flex flex-column align-items-center gap-3">
                    <div className="spinner-grow text-primary" role="status"></div>
                    <span className="fw-bold tracking-tight text-primary">INITIALIZING PORTFOLIO...</span>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="portfolio-container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div className="animate-fade-in">
                    <X size={64} className="text-danger mb-4" />
                    <h1 className="fw-bold text-dark">404: Identity Not Found</h1>
                    <p className="text-muted mb-4">{error || 'This digital space has not been claimed yet.'}</p>
                    <a href="/" className="btn btn-primary">Construct Your Own</a>
                </div>
            </div>
        );
    }

    const { user, projects, skills, education, experience } = data;
    const currentYear = new Date().getFullYear();

    return (
        <div className="portfolio-container" data-theme={isDarkMode ? 'dark' : 'light'}>
            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <h2>{user?.name?.split(' ')[0] || 'PORTFOLIO'}</h2>
                    </div>
                    <div className="nav-right d-flex align-items-center gap-3">
                        <button className="theme-btn" onClick={toggleTheme}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                            <li className="nav-item">
                                <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>Essence</a>
                            </li>
                            <li className="nav-item">
                                <a href="#experience" className="nav-link" onClick={() => setIsMenuOpen(false)}>Timeline</a>
                            </li>
                            <li className="nav-item">
                                <a href="#skills" className="nav-link" onClick={() => setIsMenuOpen(false)}>Expertise</a>
                            </li>
                            <li className="nav-item">
                                <a href="#projects" className="nav-link" onClick={() => setIsMenuOpen(false)}>Creations</a>
                            </li>
                        </ul>
                        <a href="#contact" className="btn btn-primary d-none d-md-flex px-4 py-2" style={{ borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                            Secure Collab
                        </a>
                        <button className="theme-btn d-md-none" onClick={toggleMenu}>
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-container animate-fade-in">
                    <div className="hero-content">
                        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-accent-light text-primary small fw-bold mb-4">
                            <Activity size={14} />
                            <span>AVAILABLE FOR PROJECTS</span>
                        </div>
                        <h1 className="hero-title">Crafting Digital <span className="highlight">Experiences</span> Through Code.</h1>
                        <p className="hero-subtitle">
                            Hello, I'm <span className="fw-bold text-dark">{user?.name}</span>. {user?.title || 'Creative Developer'} exploring the intersection of design and technology.
                        </p>
                        <div className="hero-buttons">
                            <a href="#contact" className="btn btn-primary">
                                Reach Out <Send size={18} />
                            </a>
                            <a href="#projects" className="btn btn-secondary">
                                View Work <ArrowUpRight size={18} />
                            </a>
                        </div>
                    </div>
                    <div className="hero-image d-none d-lg-block">
                        <div className="profile-img-container shadow-2xl">
                            <img 
                                src={user?.profileImg || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800"} 
                                alt={user?.name} 
                                className="profile-img" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about">
                <div className="container">
                    <div className="about-content animate-fade-in">
                        <div>
                            <h2 className="section-title text-start mb-4">Core Essence</h2>
                            <p className="about-description">
                                {user?.bio || "I am a passionate creator focused on building high-impact digital solutions that bridge the gap between complex problems and elegant designs."}
                            </p>
                            <div className="d-flex gap-3">
                                {user?.githubUrl && (
                                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="theme-btn" title="GitHub">
                                        <Github size={20} />
                                    </a>
                                )}
                                {user?.linkedInUrl && (
                                    <a href={user.linkedInUrl} target="_blank" rel="noopener noreferrer" className="theme-btn" title="LinkedIn">
                                        <Linkedin size={20} />
                                    </a>
                                )}
                                {user?.twitterUrl && (
                                    <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" className="theme-btn" title="Twitter">
                                        <Twitter size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="about-stats">
                            <div className="stat-item">
                                <h3>{experience?.length || 0}+</h3>
                                <p>Career Milestones</p>
                            </div>
                            <div className="stat-item">
                                <h3>{projects?.length || 0}+</h3>
                                <p>Live Productions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience & Education Section */}
            <section id="experience" className="experience bg-white">
                <div className="container">
                    <h2 className="section-title">Timeline & Growth</h2>
                    <div className="row g-5">
                        <div className="col-lg-6">
                            <div className="d-flex align-items-center gap-3 mb-5 px-3">
                                <div className="p-3 bg-primary-light text-primary rounded-4"><Briefcase size={24} /></div>
                                <h4 className="fw-bold mb-0">Professional Journey</h4>
                            </div>
                            <div className="timeline">
                                {experience?.map((exp, idx) => (
                                    <div className="timeline-item" key={exp.id || idx}>
                                        <div className="timeline-marker"></div>
                                        <span className="timeline-period">
                                            {new Date(exp.startDate).getFullYear()} — {exp.endDate ? new Date(exp.endDate).getFullYear() : 'PRESENT'}
                                        </span>
                                        <h3 className="fw-bold">{exp.position}</h3>
                                        <p className="text-primary fw-bold mb-2">{exp.company}</p>
                                        <p className="text-muted small">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex align-items-center gap-3 mb-5 px-3">
                                <div className="p-3 bg-success-light text-success rounded-4"><GraduationCap size={24} /></div>
                                <h4 className="fw-bold mb-0">Academic Foundation</h4>
                            </div>
                            <div className="timeline">
                                {education?.map((edu, idx) => (
                                    <div className="timeline-item" key={edu.id || idx}>
                                        <div className="timeline-marker"></div>
                                        <span className="timeline-period">
                                            {new Date(edu.startDate).getFullYear()} — {edu.endDate ? new Date(edu.endDate).getFullYear() : 'PRESENT'}
                                        </span>
                                        <h3 className="fw-bold">{edu.degree}</h3>
                                        <p className="text-success fw-bold mb-2">{edu.institution}</p>
                                        <p className="text-muted small">{edu.fieldOfStudy}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise Section */}
            <section id="skills" className="skills">
                <div className="container">
                    <h2 className="section-title">Technological Expertise</h2>
                    <div className="skills-grid">
                        {skills?.map((skill, idx) => (
                            <div className="skill-card" key={skill.id || idx}>
                                <div className="skill-icon-wrapper">
                                    <Code2 size={32} />
                                </div>
                                <div className="skill-name">{skill.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creations Section */}
            <section id="projects" className="projects bg-white">
                <div className="container">
                    <h2 className="section-title">Selected Creations</h2>
                    <div className="projects-grid">
                        {projects?.map((proj, idx) => (
                            <div className="project-card" key={proj.id || idx}>
                                <div className="project-image">
                                    {proj.imageUrls?.[0] ? (
                                        <img src={proj.imageUrls[0]} alt={proj.title} className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <Award size={64} className="text-muted opacity-20" />
                                    )}
                                </div>
                                <div className="project-content">
                                    <h3 className="fw-bold mb-3">{proj.title}</h3>
                                    <p className="text-muted small mb-4">{proj.description}</p>
                                    <div className="project-tech">
                                        {proj.techStack?.map((tech, i) => (
                                            <span className="tech-tag" key={i}>{tech}</span>
                                        ))}
                                    </div>
                                    <div className="d-flex gap-3">
                                        {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-dark hover-text-primary transition-all">
                                                <Github size={20} />
                                            </a>
                                        )}
                                        {proj.liveUrl && (
                                            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover-text-secondary transition-all">
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Collaboration Section */}
            <section id="contact" className="contact bg-tertiary">
                <div className="container">
                    <div className="contact-grid">
                        <div>
                            <Badge bg="primary-light" text="primary" className="px-3 py-2 rounded-pill fw-bold mb-4">CONNECT</Badge>
                            <h2 className="display-4 fw-bold mb-4">Let's build something <span className="highlight">remarkable</span>.</h2>
                            <p className="text-muted mb-5">Have a complex challenge or a visionary idea? Reach out and let's explore how we can collaborate.</p>
                            
                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-3 bg-white rounded-3 shadow-sm border"><Mail size={20} className="text-primary" /></div>
                                    <div>
                                        <div className="extra-small text-muted fw-bold">SECURE CHANNEL</div>
                                        <div className="fw-bold">{user?.email}</div>
                                    </div>
                                </div>
                                {user?.location && (
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 bg-white rounded-3 shadow-sm border"><MapPin size={20} className="text-primary" /></div>
                                        <div>
                                            <div className="extra-small text-muted fw-bold">OPERATIONS CENTER</div>
                                            <div className="fw-bold">{user.location}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="extra-small fw-bold text-muted mb-2 text-uppercase tracking-wider">Identity</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Your Name" 
                                        className="contact-input"
                                        required 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="extra-small fw-bold text-muted mb-2 text-uppercase tracking-wider">Channel</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="your@email.com" 
                                        className="contact-input"
                                        required 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="extra-small fw-bold text-muted mb-2 text-uppercase tracking-wider">Signal</label>
                                    <textarea 
                                        name="message" 
                                        placeholder="Describe the mission..." 
                                        className="contact-input"
                                        rows="4" 
                                        required 
                                        value={formData.message}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 justify-content-center py-3" disabled={formStatus === 'sending'}>
                                    {formStatus === 'sending' ? 'Transmitting...' : 'Send Transmission'}
                                </button>
                                {formStatus === 'success' && <p className="text-success small fw-bold mt-3 text-center animate-fade-in"><Activity size={12} className="me-1" /> Transmission successful.</p>}
                                {formStatus === 'error' && <p className="text-danger small fw-bold mt-3 text-center animate-fade-in"><X size={12} className="me-1" /> Transmission failed.</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer bg-white">
                <div className="container">
                    <p className="text-muted small mb-0">
                        &copy; {currentYear} Crafted by <span className="fw-bold text-dark">{user?.name}</span>. Securely deployed via Portfolio OS.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicPortfolio;
