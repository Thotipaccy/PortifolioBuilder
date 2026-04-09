import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
                    document.title = `${response.data.user.name} - Portfolio`;
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

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('Sending...');
        try {
            await api.post(`/portfolios/${username}/contact`, formData);
            setFormStatus('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch {
            setFormStatus('Failed to send message. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="portfolio-container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="portfolio-container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div>
                    <h1 style={{ color: '#e74c3c' }}>Error</h1>
                    <p>{error || 'Something went wrong'}</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Go Home</a>
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
                        <h2>{user?.name || 'PORTFOLIO'}</h2>
                    </div>
                    <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div className="theme-toggle">
                            <button className="theme-btn" onClick={toggleTheme}>
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                        </div>
                        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                            <li className="nav-item">
                                <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</a>
                            </li>
                            <li className="nav-item">
                                <a href="#education" className="nav-link" onClick={() => setIsMenuOpen(false)}>Education</a>
                            </li>
                            <li className="nav-item">
                                <a href="#skills" className="nav-link" onClick={() => setIsMenuOpen(false)}>Skills</a>
                            </li>
                            <li className="nav-item">
                                <a href="#projects" className="nav-link" onClick={() => setIsMenuOpen(false)}>Projects</a>
                            </li>
                            <li className="nav-item">
                                <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</a>
                            </li>
                        </ul>
                        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">Hello, I'm <span className="highlight">{(user?.name || 'Your Name').toUpperCase()}</span></h1>
                        <p className="hero-subtitle">{user?.title || 'Your Professional Title'}</p>
                        <div className="hero-buttons">
                            <a href="#contact" className="btn btn-primary">Get In Touch</a>
                            <a href="#projects" className="btn btn-secondary">View My Work</a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img 
                            src={user?.profileImg ? user.profileImg : "https://via.placeholder.com/320"} 
                            onError={(e) => { e.target.src = "https://via.placeholder.com/320"; }} 
                            alt={user?.name} 
                            className="profile-img" 
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about">
                <div className="container">
                    <h2 className="section-title">About Me</h2>
                    <div className="about-content">
                        <div className="about-text">
                            <p className="about-description">
                                {user?.bio}
                            </p>
                            <div className="social-links-about" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                {user?.githubUrl && (
                                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="GitHub">
                                        <i className="fab fa-github"></i>
                                    </a>
                                )}
                                {user?.linkedInUrl && (
                                    <a href={user.linkedInUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="LinkedIn">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                )}
                                {user?.twitterUrl && (
                                    <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="Twitter">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                )}
                                {user?.instagramUrl && (
                                    <a href={user.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="Instagram">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                )}
                                <a href={`mailto:${user?.email}`} className="social-pill" title="Email">
                                    <i className="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                        <div className="about-stats">
                            <div className="stat-item">
                                <h3>{experience?.length || 0}+</h3>
                                <p>Experiences</p>
                            </div>
                            <div className="stat-item">
                                <h3>{skills?.length || 0}+</h3>
                                <p>Skills Mastered</p>
                            </div>
                            <div className="stat-item">
                                <h3>{projects?.length || 0}+</h3>
                                <p>Projects Done</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education Section */}
            {education && education.length > 0 && (
                <section id="education" className="education">
                    <div className="container">
                        <h2 className="section-title">Education</h2>
                        <div className="education-timeline">
                            {education.map((edu, index) => (
                                <div className="timeline-item" key={edu.id || index}>
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h3>{edu.degree}</h3>
                                        <p className="timeline-period">
                                            {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                                        </p>
                                        <p className="timeline-school">{edu.institution}</p>
                                        <p className="timeline-description">{edu.fieldOfStudy}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {skills && skills.length > 0 && (() => {
                const technicalSkills = skills.filter(s => 
                    !s.category?.toLowerCase().includes('soft') && 
                    !s.category?.toLowerCase().includes('personal')
                );
                const softSkills = skills.filter(s => 
                    s.category?.toLowerCase().includes('soft') || 
                    s.category?.toLowerCase().includes('personal')
                );

                const getSkillIcon = (skillName, currentIcon) => {
                    const name = skillName.toLowerCase();
                    if (name.includes('html')) return "devicon-html5-plain colored";
                    if (name.includes('css')) return "devicon-css3-plain colored";
                    if (name.includes('javascript') || name === 'js') return "devicon-javascript-plain colored";
                    if (name.includes('react')) return "devicon-react-original colored";
                    if (name.includes('node')) return "devicon-nodejs-plain colored";
                    if (name.includes('python')) return "devicon-python-plain colored";
                    if (name.includes('java') && !name.includes('script')) return "devicon-java-plain colored";
                    if (name.includes('oracle') || name.includes('sql')) return "fas fa-database";
                    if (name.includes('big data')) return "fas fa-server";
                    if (name.includes('leadership')) return "fas fa-users";
                    if (name.includes('team work')) return "fas fa-handshake";
                    if (name.includes('communication')) return "fas fa-comments";
                    if (name.includes('time management')) return "fas fa-clock";
                    if (name.includes('driving')) return "fas fa-car";
                    return currentIcon || "fas fa-code";
                };

                const renderSkillCard = (skill, index) => (
                    <div className="skill-card" key={skill.id || index}>
                        <div className="skill-icon-wrapper">
                            <i className={getSkillIcon(skill.name, skill.icon)}></i>
                        </div>
                        <span className="skill-name">{skill.name}</span>
                    </div>
                );

                return (
                    <section id="skills" className="skills">
                        <div className="container">
                            <div className="skills-main-grid">
                                <div className="skills-column">
                                    <h2 className="skills-group-title">Technical Skills</h2>
                                    <div className="skills-items-grid">
                                        {technicalSkills.map((skill, index) => renderSkillCard(skill, index))}
                                    </div>
                                </div>
                                <div className="skills-column">
                                    <h2 className="skills-group-title">Soft Skills</h2>
                                    <div className="skills-items-grid">
                                        {softSkills.map((skill, index) => renderSkillCard(skill, index))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* Experience Section */}
            {experience && experience.length > 0 && (
                <section id="experience" className="experience" style={{ backgroundColor: 'var(--bg-secondary)', padding: '5rem 0' }}>
                    <div className="container">
                        <h2 className="section-title">Experience</h2>
                        <div className="education-timeline">
                            {experience.map((exp, index) => (
                                <div className="timeline-item" key={exp.id || index}>
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h3>{exp.position}</h3>
                                        <p className="timeline-period">
                                            {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                                        </p>
                                        <p className="timeline-school">{exp.company}</p>
                                        <p className="timeline-description">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {projects && projects.length > 0 && (
                <section id="projects" className="projects">
                    <div className="container">
                        <h2 className="section-title">Featured Projects</h2>
                        <div className="projects-grid">
                            {projects.map((proj, index) => (
                                <div className="project-card" key={proj.id || index}>
                                    <div className="project-image">
                                        {proj.imageUrls && proj.imageUrls[0] ? (
                                            <img src={proj.imageUrls[0]} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <i className="fas fa-project-diagram"></i>
                                        )}
                                    </div>
                                    <div className="project-content">
                                        <h3>{proj.title}</h3>
                                        <p>{proj.description}</p>
                                        <div className="project-tech">
                                            {proj.techStack?.map((tech, i) => (
                                                <span className="tech-tag" key={i}>{tech}</span>
                                            ))}
                                        </div>
                                        {proj.githubUrl && (
                                            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                                                <i className="fab fa-github"></i> View on GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section id="contact" className="contact">
                <div className="container">
                    <h2 className="section-title">Get In Touch</h2>
                    <div className="contact-content">
                        <div className="contact-info">
                            <h3 className="connect-title">Let's Connect</h3>
                            <p className="contact-description">
                                {user?.contactDescription || "I'm always interested in new opportunities and collaborations. Feel free to reach out if you'd like to discuss projects, ideas, or just say hello!"}
                            </p>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <span>{user?.email}</span>
                                </div>
                                {user?.phone && (
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="fas fa-phone"></i>
                                        </div>
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                {user?.location && (
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="fas fa-map-marker-alt"></i>
                                        </div>
                                        <span>{user.location}</span>
                                    </div>
                                )}
                            </div>
                            <div className="social-links-footer">
                                {user?.githubUrl && (
                                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="GitHub">
                                        <i className="fab fa-github"></i>
                                    </a>
                                )}
                                {user?.linkedInUrl && (
                                    <a href={user.linkedInUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="LinkedIn">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                )}
                                {user?.twitterUrl && (
                                    <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="Twitter">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                )}
                                {user?.instagramUrl && (
                                    <a href={user.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-pill" title="Instagram">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                )}
                                <a href={`mailto:${user?.email}`} className="social-pill" title="Email">
                                    <i className="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                        <div className="contact-form-card">
                            <form id="contactForm" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Your Name" 
                                        required 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Your Email" 
                                        required 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        name="message" 
                                        placeholder="Your Message" 
                                        rows="5" 
                                        required 
                                        value={formData.message}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Send Message</button>
                                {formStatus && <p id="form-status" className="form-status-msg">{formStatus}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-text">
                            <p>&copy; {currentYear} {user?.name}. All rights reserved.</p>
                        </div>
                        <div className="footer-links">
                            <a href="#about">About</a>
                            <a href="#education">Education</a>
                            <a href="#skills">Skills</a>
                            <a href="#projects">Projects</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicPortfolio;
