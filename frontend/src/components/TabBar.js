import React, { Component } from "react";
import { gs } from "../util/react-global-state";

import { views } from "../router";
import Modal from "./Modal";

class TabBar extends Component {

  state = {
    username: "",
    password: "",
    error: ""
  };

  setLoggedIn(loggedIn) {
    if (!loggedIn) this.setState({ username: "", password: "" });
    this.props.setState({ loggedIn });
  }

  logout() {
    this.setLoggedIn(false);
  }

  createLogoutButton() {
    return (
      <button className="login-button btn btn-warning" type="button" onClick={this.logout.bind(this)}>
        <span className="button-icon fa fa-user-circle"/> Log Out
      </button>
    )
  }

  createLoginButton() {
    return (
      <button type="button" className="login-button btn btn-info" data-toggle="modal" data-target="#loginModal">
        <span className="button-icon fa fa-user-circle"/> Log In
      </button>
    );
  }

  loginSuccessful(username, password) {
    return username === "kashif" && password === "tomato";
  }

  login(event) {
    event.preventDefault();

    const { username, password } = this.state;
    if (this.loginSuccessful(username, password)) {
      document.querySelector("#loginModal button.close").click();
      this.setLoggedIn(true);
    } else {
      this.setState({ error: "Invalid login." })
    }
  }

  setField(fieldname, value) {
    this.setState({ [fieldname]: value, error: "" });
  }

  createLoginModal() {
    return (
      <Modal title="Log In" id="loginModal">
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="username" className="login-form-icon fa fa-user-circle input-group-addon"/>
            <input className="form-control" id="username" placeholder="Username"
                   value={this.state.username} onChange={event => this.setField("username", event.target.value)}/>
          </div>
          <div className="input-group">
            <label htmlFor="password" className="login-form-icon fa fa-lock input-group-addon"/>
            <input type="password" className="form-control" id="username" placeholder="Password"
                   value={this.state.password} onChange={event => this.setField("password", event.target.value)}/>
          </div>
          {
            this.state.error &&
            <div className="error">{this.state.error}</div>
          }
          <button className="btn btn-success login-form-submit" type="submit" onClick={this.login.bind(this)}>
            Submit
          </button>
        </form>
      </Modal>
    )
  }

  createLoggedInInfo() {
    return (
      <div className="logged-in-info flex-group">
        <span className="logged-in-msg">Logged in as <strong>{this.state.username}</strong></span>
        {this.createLogoutButton()}
      </div>
    );
  }

  createLoginComponents() {
    const { loggedIn } = this.props.state;
    const className = `login-components ${loggedIn ? "logged-in" : ""}`.trim();
    return (
      <div className={className}>
        {loggedIn && this.createLoggedInInfo()}
        {!loggedIn && this.createLoginButton()}
        {this.createLoginModal()}
      </div>
    )
  }

  createNavItem(description, { component, path }) {
    const { view } = this.props;
    const active = view.constructor === component || view.constructor === component.Component;
    const className = `nav-link ${active ? "active" : ""}`.trim();
    return (
      <li className="nav-item">
        <a className={className} href={path}>{description}</a>
      </li>
    );
  }

  createNavLinks() {
    const className = `nav nav-tabs ${this.props.state.loggedIn ? "logged-in" : ""}`.trim();
    return (
      <ul className={className}>
        {this.createNavItem("Abbreviations", views.list)}
        {this.props.state.loggedIn && this.createNavItem("History", views.history)}
        {this.createNavItem("About", views.about)}
      </ul>
    );
  }

  render() {
    return (
      <div className="tab-bar">
        {this.createNavLinks()}
        {this.createLoginComponents()}
      </div>
    );
  }
}

export default gs(TabBar);
