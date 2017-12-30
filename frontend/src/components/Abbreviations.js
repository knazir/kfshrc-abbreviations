import React, { Component } from "react";

import { gs } from "../util/react-global-state";
import Api from "../Api";
import TabView from "./TabView";

class Abbreviations extends Component {
  state = {
    list: [],
    map: {}
  };

  componentWillMount() {
    this.loadAbbreviationList();
  }

  async loadAbbreviationList() {
    const list = await Api.list();
    const map = {};
    list.forEach(item => {
      if (map[item[0]]) map[item[0]].push(item);
      else map[item[0]] = [item];
    });
    this.setState({ list, map });
  }

  render() {
    return (
      <TabView view={this}>
        <div className="abbreviations">
          <h1>Abbreviations</h1>
        </div>
      </TabView>
    );
  }
}

export default gs(Abbreviations);
