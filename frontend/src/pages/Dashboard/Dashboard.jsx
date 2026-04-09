import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button } from 'react-bootstrap';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
    { path: '', label: 'Overview', icon: 'bi-grid' },
    { path: 'editor', label: 'Portfolio Editor', icon: 'bi-pencil-square' },
    { path: 'projects', label: 'Projects', icon: 'bi-briefcase' },
    { path: 'experience', label: 'Experience', icon: 'bi-award' },
    { path: 'education', label: 'Education', icon: 'bi-book' },
    { path: 'skills', label: 'Skills', icon: 'bi-code-slash' },
    { path: 'settings', label: 'Settings', icon: 'bi-gear' },
  ];

  const adminItems = [
    { path: 'admin/stats', label: 'System Stats', icon: 'bi-graph-up' },
    { path: 'admin/users', label: 'User Management', icon: 'bi-people' },
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3} lg={2} className="border-end">
          <div className="d-flex flex-column h-100">
            <h5 className="mb-4 px-3">Dashboard</h5>
            <Nav variant="pills" className="flex-column mb-auto">
              {navItems.map(item => (
                <Nav.Item key={item.path}>
                  <Nav.Link 
                    as={Link} 
                    to={`/dashboard/${item.path}`} 
                    active={location.pathname === `/dashboard${item.path ? '/' + item.path : ''}`}
                    className="d-flex align-items-center gap-2 mb-1"
                  >
                    <i className={`bi ${item.icon}`}></i>
                    {item.label}
                  </Nav.Link>
                </Nav.Item>
              ))}

              {user?.role === 'ADMIN' && (
                <>
                  <hr />
                  <small className="text-muted px-3 mb-2 d-block">Admin Panel</small>
                  {adminItems.map(item => (
                    <Nav.Item key={item.path}>
                      <Nav.Link 
                        as={Link} 
                        to={`/dashboard/${item.path}`}
                        active={location.pathname.includes(item.path)}
                        className="d-flex align-items-center gap-2 mb-1 text-danger"
                      >
                        <i className={`bi ${item.icon}`}></i>
                        {item.label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </>
              )}
            </Nav>
            <hr />
            <div className="px-3 mb-3">
              {portfolio && (
                <a 
                  href={`/${portfolio.username}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-eye"></i>
                  View Portfolio
                </a>
              )}
            </div>
            <Button variant="outline-danger" className="w-100 mb-2" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Col>
        <Col md={9} lg={10}>
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
  return (
    <Card className="bg-primary text-white border-0 shadow-sm">
      <Card.Body className="p-4">
        <h2>Welcome back, {user?.name}!</h2>
        <p className="lead mb-0">Use the sidebar to manage your portfolio content and settings.</p>
      </Card.Body>
    </Card>
  );
};



export default Dashboard;
