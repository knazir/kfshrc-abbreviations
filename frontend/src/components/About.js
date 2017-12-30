import React, { Component } from "react";

import TabView from "./TabView";

class About extends Component {
  render() {
    return (
      <TabView view={this}>
        <h1>About</h1>
      </TabView>
    );
  }
}

export default About;
