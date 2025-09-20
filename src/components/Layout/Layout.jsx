import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';

const Layout = ({ children, onSearchChange, onShowAddSweet }) => {
  return (
    <div className="min-vh-100 bg-light">
      <Header 
        onSearchChange={onSearchChange}
        onShowAddSweet={onShowAddSweet}
      />
      <main className="py-4">
        <Container fluid className="px-3 px-md-4">
          {children}
        </Container>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-top mt-auto py-3">
        <Container>
          <div className="row align-items-center">
            <div className="col-md-6">
              <small className="text-muted">
                © 2024 Sweet Shop Management System. Built with ❤️ using React & Bootstrap.
              </small>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-muted">
                Version 1.0.0 | TDD Implementation
              </small>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;