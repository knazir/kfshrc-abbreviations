import React, { Component } from "react";
import { gs } from "../util/react-global-state";

class ForbiddenToolbar extends Component {

  state = {
    inputText: "",
    searchColumn: "abbreviation"
  };

  setSearchColumn(event) {
    this.setState({ searchColumn: event.target.value });
  }
  
  createSearchDropdown() {
    return (
      <div>
        <select className="search-dropdown" defaultValue="abbreviation" onChange={this.setSearchColumn.bind(this)}>
          <option value="abbreviation">Abbreviation</option>
          <option value="description">Description</option>
        </select>
      </div>
    );
  }

  search(event) {
    event.preventDefault();
    const { searchColumn, inputText } = this.state;
    this.props.filterResults(searchColumn, inputText);
  }

  createSearchInput() {
    return (
      <div className="search-input input-group">
        <form className="form-inline">
          {this.createSearchDropdown()}
          <input type="text" className="form-control" placeholder="Search..." value={this.state.inputText}
                 onChange={event => this.setState({ inputText: event.target.value })}/>
          <span className="input-group-btn">
              <button className="btn btn-success" type="submit" onClick={this.search.bind(this)}>
                <span className="fa fa-search"/>
              </button>
          </span>
        </form>
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

export default gs(ForbiddenToolbar);
