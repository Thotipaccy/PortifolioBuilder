import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Code2, 
  Settings as SettingsIcon, 
  Eye, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  Terminal
} from 'lucide-react';
import { Github } from '../../components/SocialIcons';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

// Sub-pages
import PortfolioEditor from './PortfolioEditor';
import Projects from './Projects';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Settings from './Settings';
import AdminStats from '../Admin/AdminStats';
import AdminUsers from '../Admin/AdminUsers';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolio, setPortfolio] = useState(null);

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get('/portfolios/me');
      setPortfolio(data);
    } catch {
      // Portfolio might not exist yet
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await api.get('/portfolios/me');
      if (isMounted) setPortfolio(data);
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '', label: 'Overview', icon: LayoutDashboard },
    { path: 'editor', label: 'Portfolio Editor', icon: FileText },
    { path: 'projects', label: 'Projects', icon: Briefcase },
    { path: 'experience', label: 'Experience', icon: Award },
    { path: 'education', label: 'Education', icon: GraduationCap },
    { path: 'skills', label: 'Skills', icon: Code2 },
    { path: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const adminItems = [
    { path: 'admin/stats', label: 'System Stats', icon: TrendingUp },
    { path: 'admin/users', label: 'User Management', icon: Users },
  ];

  return (
    <Container fluid className="p-0 vh-100 overflow-hidden">
      <Row className="g-0 h-100">
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-white border-end shadow-sm d-flex flex-column h-100 z-1">
          <div className="p-4 mb-2">
            <h4 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
              <Code2 size={28} />
              Portfolio
            </h4>
          </div>
          
          <Nav variant="pills" className="flex-column flex-grow-1 px-3 mt-2 scrollbar-hide">
            {navItems.map(item => {
              const isActive = location.pathname === `/dashboard${item.path ? '/' + item.path : ''}`;
              return (
                <Nav.Item key={item.path} className="mb-1">
                  <Nav.Link 
                    as={Link} 
                    to={`/dashboard/${item.path}`} 
                    active={isActive}
                    className={`d-flex align-items-center justify-content-between px-3 py-2 rounded-3 transition-all ${isActive ? 'shadow-sm' : 'text-secondary hover-bg-light'}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <item.icon size={18} />
                      <span className="fw-medium">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} />}
                  </Nav.Link>
                </Nav.Item>
              );
            })}
 
            {user?.role === 'ADMIN' && (
              <>
                <div className="px-3 mt-4 mb-2 small fw-bold text-uppercase text-muted border-top pt-4" style={{ letterSpacing: '0.5px', fontSize: '10px' }}>
                  Admin Panel
                </div>
                {adminItems.map(item => {
                  const isActive = location.pathname.includes(item.path);
                  return (
                    <Nav.Item key={item.path} className="mb-1">
                      <Nav.Link 
                        as={Link} 
                        to={`/dashboard/${item.path}`}
                        active={isActive}
                        className={`d-flex align-items-center justify-content-between px-3 py-2 rounded-3 transition-all ${isActive ? 'shadow-sm bg-danger text-white' : 'text-danger hover-bg-danger-light'}`}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <item.icon size={18} />
                          <span className="fw-medium">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size={14} />}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </>
            )}
          </Nav>
          
          <div className="p-3 border-top mt-auto">
            {portfolio && (
              <a 
                href={`/${portfolio.username}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-success w-100 mb-2 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm border-0"
              >
                <Eye size={18} />
                View Portfolio
              </a>
            )}
            <Button 
              variant="outline-danger" 
              className="w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 border-2 fw-semibold" 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="bg-light vh-100 overflow-auto p-4 p-lg-5">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="editor" element={<PortfolioEditor />} />
            <Route path="projects" element={<Projects />} />
            <Route path="experience" element={<Experience />} />
            <Route path="education" element={<Education />} />
            <Route path="skills" element={<Skills />} />
            <Route path="settings" element={<Settings onUpdate={fetchPortfolio} />} />
            {user?.role === 'ADMIN' && (
              <>
                <Route path="admin/stats" element={<AdminStats />} />
                <Route path="admin/users" element={<AdminUsers />} />
              </>
            )}
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ projects: 0, skills: 0, experience: 0, education: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [proj, skill, exp, edu] = await Promise.all([
          api.get('/projects'),
          api.get('/skills'),
          api.get('/experience'),
          api.get('/education')
        ]);
        setStats({
          projects: proj.data.length,
          skills: skill.data.length,
          experience: exp.data.length,
          education: edu.data.length
        });
      } catch {
        console.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="animate-fade-in">
      {/* Welcome Hero */}
      <Card className="bg-primary text-white border-0 shadow-lg mb-4 overflow-hidden rounded-4 position-relative">
        <div className="position-absolute top-0 end-0 p-5 opacity-10">
          <Code2 size={120} />
        </div>
        <Card.Body className="p-5 position-relative z-1">
          <h2 className="display-6 fw-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="lead opacity-75 mb-4">Your professional portfolio is ready for its next update. Showcase your latest achievements to the world.</p>
          <div className="d-flex gap-3">
            <Button as={Link} to="/dashboard/editor" variant="light" className="px-4 py-2 rounded-3 text-primary fw-bold shadow-sm">
              Launch Editor
            </Button>
            <Button as={Link} to="/dashboard/settings" variant="outline-light" className="px-4 py-2 rounded-3 border-2 fw-bold">
              Profile Settings
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Stats Quick Grid */}
      <Row className="g-4 mb-5">
        {[
          { label: 'Total Projects', value: stats.projects, icon: Briefcase, color: 'primary' },
          { label: 'Technical Skills', value: stats.skills, icon: Terminal, color: 'success' },
          { label: 'Career Milestones', value: stats.experience, icon: Award, color: 'warning' },
          { label: 'Academic Records', value: stats.education || 0, icon: GraduationCap, color: 'info' }
        ].map((stat, i) => (
          <Col md={3} key={i}>
            <Card className="border-0 shadow-sm rounded-4 h-100 transition-all hover-translate-y">
              <Card.Body className="p-4 d-flex align-items-center gap-3">
                <div className={`p-3 rounded-4 bg-${stat.color}-light text-${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                  <p className="text-muted small mb-0 fw-medium">{stat.label}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions / Tips */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 p-2">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold mb-0">System Integration Status</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <Github size={20} className="text-dark" />
                    <div>
                      <div className="fw-bold small">GitHub Connectivity</div>
                      <div className="text-muted extra-small">Synchronizing repository metadata and commit history</div>
                    </div>
                  </div>
                  <Badge bg="success-light" text="success" className="border border-success opacity-75">Connected</Badge>
                </div>
                <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <Eye size={20} className="text-primary" />
                    <div>
                      <div className="fw-bold small">SEO Optimization</div>
                      <div className="text-muted extra-small">Meta tags and OpenGraph data are being indexed</div>
                    </div>
                  </div>
                  <Badge bg="primary-light" text="primary" className="border border-primary opacity-75">Optimized</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 bg-dark text-white shadow-lg rounded-4 h-100">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="mb-4">
                <Badge bg="primary" className="mb-2">Pro Tip</Badge>
                <h6 className="fw-bold mb-3 small text-uppercase" style={{ letterSpacing: '1px' }}>Elevate your brand</h6>
                <p className="small opacity-75">High-quality project images increase viewer engagement by up to 80%. Consider adding 16:9 mockups to your top projects.</p>
              </div>
              <Button as={Link} to="/dashboard/projects" variant="primary" className="mt-auto w-100 rounded-3 py-2 fw-bold shadow-sm">
                Add Visuals
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};



export default Dashboard;
