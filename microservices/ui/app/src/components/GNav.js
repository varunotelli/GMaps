import React, { Component } from "react";
import { Navbar, NavbarBrand } from "reactstrap";

export default class GNav extends Component {
  render() {
    return (
      <div id="navbar-div">
        <Navbar
          color="faded"
          className="bg-dark navbar-dark"
          expand="md"
          id="navbar"
        >
          <NavbarBrand href="/" className="ml-md-5" id="navbar-brand">
            G Map
          </NavbarBrand>
        </Navbar>
      </div>
    );
  }
}
