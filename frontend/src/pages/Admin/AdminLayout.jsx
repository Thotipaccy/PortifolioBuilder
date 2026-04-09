import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Routes, Route } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminStats from './AdminStats';

const AdminLayout = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="bg-dark text-white sidebar py-4" style={{ minHeight: '90vh' }}>
          <h4 className="px-3 mb-4">Admin Panel</h4>
          <Nav className="flex-column nav-pills">
            <Nav.Link as={Link} to="/admin" className="text-white px-3 py-2">Stats Overview</Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white px-3 py-2">Manage Users</Nav.Link>
            <Nav.Link as={Link} to="/admin/templates" className="text-white px-3 py-2">Manage Templates</Nav.Link>
            <hr className="bg-secondary" />
            <Nav.Link as={Link} to="/dashboard" className="text-info px-3 py-2">Back to Dashboard</Nav.Link>
          </Nav>
        </Col>

        <Col md={9} lg={10} className="py-4 px-4">
          <Routes>
            <Route path="/" element={<AdminStats />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="templates" element={<h4>Template Management (Coming Soon)</h4>} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
