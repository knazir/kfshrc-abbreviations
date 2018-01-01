import React, { Component } from "react";

import { gs } from "../util/react-global-state";
import Api from "../Api";
import ListToolbar from "./ListToolbar";
import TabView from "./TabView";

class AbbreviationList extends Component {

  state = {
    list: [],
    originalList: [],
    selection: []
  };

  componentWillMount() {
    this.loadAbbreviationList();
  }

  async loadAbbreviationList() {
    this.loading = true;
    const list = await Api.forbidden();
    list.forEach(item => item.selected = false);
    const originalList = list.slice();
    this.setState({ list, originalList }, () => this.loading = false);
  }

  massSelect(checked) {
    const list = this.state.list;
    list.forEach(item => item.selected = checked);
    const selection = checked ? list.slice() : [];
    this.setState({ list, selection });
  }

  createSelectAllCheckbox() {
    return <input type="checkbox" onChange={event => this.massSelect(event.target.checked)}/>;
  }

  get columnNames() {
    let columns = ["Abbreviation", "Intended Meaning", "Comments", "Correct Usage"];
    if (this.props.state.loggedIn) columns = [this.createSelectAllCheckbox()].concat(columns);
    return columns;
  }

  createTableHead() {
    const headerCells = this.columnNames.map(name => <th key={name}>{name}</th>);
    return (
      <thead>
        <tr>
          {headerCells}
        </tr>
      </thead>
    )
  }

  toggleSelect(item, checked) {
    item.selected = checked;
    const selection = this.state.selection;
    if (checked) selection.push(item);
    else selection.splice(selection.indexOf(item), 1);
    this.setState({ selection });
  }

  createSelectCheckbox(item) {
    return <input type="checkbox" checked={item.selected}
                  onChange={event => this.toggleSelect(item, event.target.checked)}/>;
  }

  createTableRows() {
    return this.state.list.map((item, index) => {
      return (
        <tr key={`${item.abbreviation}-${index}`}>
          {this.props.state.loggedIn && <td>{this.createSelectCheckbox(item)}</td>}
          <td>{item.abbreviation}</td>
          <td>{item.intendedMeaning}</td>
          <td>{item.comments}</td>
          <td>{item.correctUsage}</td>
        </tr>
      );
    });
  }

  createTable() {
    return (
      <table className="table table-striped">
        {this.createTableHead()}
        <tbody>
          {this.createTableRows()}
        </tbody>
      </table>
    );
  }

  filterResults(column, search) {
    if (!search) return this.setState({ list: this.state.originalList.slice(), selection: [] });
    const list = this.state.originalList.filter(item => item[column].toLowerCase().indexOf(search.toLowerCase()) !== -1);
    const selection = [];
    this.setState({ list, selection });
  }

  createUnapprovedMessage() {
    return <h4 className="unapproved-msg">This abbreviation is not in the <strong>DO NOT USE</strong> list</h4>
  }

  createWarning() {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>DO NOT USE</strong> any of these abbreviations
      </div>
    );
  }

  render() {
    return (
      <TabView view={this}>
        <div className="abbreviation-list">
          {this.createWarning()}
          <ListToolbar selection={this.state.selection} filterResults={this.filterResults.bind(this)}/>
          {this.createTable()}
        </div>
        {this.state.list.length === 0 && !this.loading && this.createUnapprovedMessage()}
      </TabView>
    );
  }
}

export default gs(AbbreviationList);
