import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer() {
  return (
    <>
      <footer
        style={{
          backgroundColor: 'black', // Change background to black
          color: 'white', // Change text color to white
          padding: '20px 0',
          width: '100%',
          // borderTopLeftRadius: '20px', // Add border radius to the top section
          // borderTopRightRadius: '20px',
          // Removed box shadow
        }}
      >
        <Container>
          <Row>
            <Col md={6} className="d-flex align-items-center">
              <h5 style={{ margin: 0 }}>Protien Pro</h5>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex' }}>
                <li style={{ marginRight: '20px' }}>
                  <a href="/contact" style={linkStyle}>
                    Contact Us
                  </a>
                </li>
                <li style={{ marginRight: '20px' }}>
                  <a href="/signin" style={linkStyle}>
                    Sign In
                  </a>
                </li>
                <li style={{ marginRight: '20px' }}>
                  <a href="/signup" style={linkStyle}>
                    Sign Up
                  </a>
                </li>
                {/* <li style={{ marginRight: '20px' }}>
                  <a href="/help" style={linkStyle}>
                    Help
                  </a>
                </li> */}
                <li>
                  <a href="/terms" style={linkStyle}>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <hr style={{ borderColor: 'white', margin: '20px 0' }} /> {/* Change hr color to white */}
          <Row>
            <Col className="text-center">
              <p style={{ margin: 0 }}>© 2024 Protien Pro. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Inline CSS for the sticky footer */}
      <style jsx="true">{`
        html, body {
          height: 100%;
          margin: 0;
        }

        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        main {
          flex: 1;
        }

        footer {
          margin-top: auto;
        }

        a {
          color: white; // Change link color to white for better visibility
          text-decoration: none;
          transition: all 0.3s ease;
        }

        a:hover {
          text-decoration: underline; // Optional: Add underline on hover
        }
      `}</style>
    </>
  );
}

const linkStyle = {
  color: 'white', // Change link color to white
  textDecoration: 'none',
  transition: 'all 0.3s ease',
};
