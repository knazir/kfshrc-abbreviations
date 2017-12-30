import React, { Component } from "react";

import { gs } from "../util/react-global-state";
import ListToolbar from "./ListToolbar";
import TabView from "./TabView";

class AbbreviationList extends Component {

  state = { selection: [] };

  get columnNames() {
    return ["", "Abbreviation", "Description", "Notes"];
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

  createTable() {
    return (
      <table className="table table-striped">
        {this.createTableHead()}
      </table>
    );
  }

  render() {
    return (
      <TabView view={this}>
        <div className="abbreviation-list">
          <ListToolbar selection={this.state.selection}/>
          {this.createTable()}
        </div>
      </TabView>
    );
  }
}

export default gs(AbbreviationList);
