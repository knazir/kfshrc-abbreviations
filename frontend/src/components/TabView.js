import React  from 'react';

import Header from "./Header";
import TabBar from "./TabBar";

const TabView = ({ children, view }) => {
  return (
    <div className="app">
      <Header/>
      <TabBar view={view}/>
      <div className="tab-component">{children}</div>
    </div>
  );
};

export default TabView;
