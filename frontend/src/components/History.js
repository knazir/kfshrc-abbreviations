import React, { Component } from "react";

import TabView from "./TabView";

class History extends Component {
  render() {
    return (
      <TabView view={this}>
        <div className="history">
          <h1>History</h1>
        </div>
      </TabView>
    );
  }
}

export default History;
