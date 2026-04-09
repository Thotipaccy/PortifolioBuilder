import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
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

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h3 className="mb-4">System Analytics</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={4}>
          <Card className="text-center shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h2 className="text-primary">{stats?.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Active Portfolios</Card.Title>
              <h2 className="text-success">{stats?.totalPortfolios}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Total Portfolio Views</Card.Title>
              <h2 className="text-info">{stats?.totalViews}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStats;
