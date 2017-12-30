import React, { Component } from "react";

import { gs } from "../util/react-global-state";
import TabView from "./TabView";

class Abbreviations extends Component {
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
