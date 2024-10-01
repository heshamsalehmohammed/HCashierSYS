import React from "react";

import "./SysNavBar.scss";
import { Link } from "react-router-dom";

const SysNavBar = () => {
  return (
    <div className="sys-nav-container">
      {/* <Navbar
        collapseOnSelect
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand as={Link} to="/home" style={{ marginLeft: "20px" }}>
            TMS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to="/home/vacations" className="nav-link">
                Vacations
              </Link>
              <Link to="/home/timesheet" className="nav-link">
                Time Sheet
              </Link>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar> */}
    </div>
  );
};

export default SysNavBar;
