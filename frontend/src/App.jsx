import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home/Home';
import PublicPortfolio from './pages/Portfolio/PublicPortfolio';
import AdminLayout from './pages/Admin/AdminLayout';

// Layout wrapper for site-wide Navbar/Container
const MainLayout = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Portfolio Builder</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Full-screen route for public portfolios (Old format) */}
        <Route path="/portfolio/:username" element={<PublicPortfolio />} />

        {/* Home & Auth Routes (Shared Navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Clean Portfolio URLs (Least specific, matches anything else) */}
        {/* 
            React Router 6 automatically prioritizes literal paths (like /login) 
            over dynamic params (like /:username) when they are siblings.
        */}
        <Route path="/:username" element={<PublicPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
