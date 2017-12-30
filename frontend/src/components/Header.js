import React from "react";

import logo from "../img/logo.png";

const Header = () => {
  return (
    <header>
      <img className="logo" src={logo} alt="KFSH&RC Logo"/>
      <h1>KFSH&RC Medical Abbreviations</h1>
    </header>
  );
};

export default Header;
