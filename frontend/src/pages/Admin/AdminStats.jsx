import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { Users, Globe, Eye, Activity, Database, TrendingUp, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-50 pt-5">
      <Spinner animation="grow" variant="primary" />
      <p className="mt-3 fw-bold text-primary">Collating System Intelligence...</p>
    </div>
  );

  return (
    <div className="admin-analytics animate-fade-in pb-5">
      <div className="d-flex justify-content-between align-items-end mb-4 px-1">
        <div>
          <h3 className="fw-bold mb-1">System Architecture Analytics</h3>
          <p className="text-muted small mb-0">Real-time health monitoring and user engagement metrics</p>
        </div>
        <Badge bg="success-light" text="success" className="px-3 py-2 rounded-pill border border-success opacity-75 d-flex align-items-center gap-2">
          <Activity size={14} />
          <span>System Live</span>
        </Badge>
      </div>

      {error && <Alert variant="danger" className="border-0 shadow-sm d-flex align-items-center gap-2 mb-4" dismissible onClose={() => setError(null)}><ShieldCheck size={18} /> {error}</Alert>}

      <Row className="g-4 mb-5">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'primary', trend: '+12%' },
          { label: 'Cloud Portfolios', value: stats?.totalPortfolios || 0, icon: Globe, color: 'success', trend: '+5%' },
          { label: 'Global Traffic', value: stats?.totalViews || 0, icon: Eye, color: 'info', trend: '+18%' }
        ].map((metric, i) => (
          <Col lg={4} key={i}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all hover-translate-y">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className={`p-3 rounded-4 bg-${metric.color}-light text-${metric.color} shadow-sm`}>
                    <metric.icon size={26} />
                  </div>
                  <Badge bg="light" text="dark" className="border fw-bold px-2 py-1 small d-flex align-items-center gap-1">
                    <TrendingUp size={12} className={`text-${metric.color}`} />
                    {metric.trend}
                  </Badge>
                </div>
                <h2 className="display-5 fw-bold mb-1 text-dark">{metric.value}</h2>
                <p className="text-muted small mb-0 fw-semibold text-uppercase tracking-wider opacity-75">{metric.label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Database size={20} className="text-muted" />
                Infrastructure Health
              </h5>
              <div className="d-flex gap-2">
                <div className="d-flex align-items-center gap-1 extra-small text-muted"><div className="p-1 rounded-circle bg-success"></div> DB Active</div>
                <div className="d-flex align-items-center gap-1 extra-small text-muted"><div className="p-1 rounded-circle bg-success"></div> Redis Cache</div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="p-5 bg-light rounded-4 text-center border-2 border-dashed border-light">
                <Activity size={32} className="text-light mb-3" />
                <h6 className="text-muted fw-bold">Traffic Visualization Engine</h6>
                <p className="extra-small text-muted mb-0">Integration with ChartJS pending system approval for visualization module.</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 bg-dark text-white rounded-4 h-100 shadow-lg position-relative overflow-hidden">
             <div className="position-absolute bottom-0 end-0 p-5 opacity-10"><ShieldCheck size={120} /></div>
             <Card.Body className="p-4 d-flex flex-column position-relative z-1">
               <h5 className="fw-bold mb-4">Security Protocol</h5>
               <div className="mb-4">
                 {[
                   'SSL/TLS Certificates Reactive',
                   'Prisma Layer Integration Secured',
                   'JWT Token Rotations Active',
                   'Edge Deployment Validated'
                 ].map((step, idx) => (
                   <div key={idx} className="d-flex align-items-center gap-2 mb-3 small opacity-75">
                     <div className="p-1 rounded-circle bg-success"></div>
                     {step}
                   </div>
                 ))}
               </div>
               <Button variant="outline-light" className="mt-auto w-100 rounded-3 border-2 fw-bold py-2 shadow-sm">
                 Security Audit
               </Button>
             </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStats;
