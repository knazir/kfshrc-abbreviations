import React, { Component } from "react";
import { gs } from "../util/react-global-state";

class ListToolbar extends Component {

  createSearchInput() {
    return (
      <div className="search-input input-group">
        <input type="text" className="form-control" placeholder="Search..."/>
        <span className="input-group-btn">
            <button className="btn btn-success" type="button">
              <span className="fa fa-search"/>
            </button>
          </span>
      </div>
    );
  }

  createAddButton() {
    return (
      <button className="btn btn-success" type="button">
        <span className="button-icon fa fa-plus"/> Add New
      </button>
    )
  }

  createDeleteButton() {
    const buttonClassName = `btn btn-danger ${this.props.selection.length === 0 ? "disabled" : ""}`.trim();
    return (
      <button className={buttonClassName} type="button">
        <span className="button-icon fa fa-remove"/> Delete Selected
      </button>
    )
  }

  createAdminButtons() {
    return (
      <div className="button-group">
        {this.createAddButton()}
        {this.createDeleteButton()}
      </div>
    )
  }

  render() {
    return (
      <div className="toolbar">
        {this.createSearchInput()}
        {this.props.state.loggedIn && this.createAdminButtons()}
      </div>
    );
  }
}

export default gs(ListToolbar);
