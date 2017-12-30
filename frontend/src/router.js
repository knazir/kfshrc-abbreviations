import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Abbreviations from "./components/Abbreviations";
import AbbreviationList from "./components/AbbreviationList";
import About from "./components/About";
import History from "./components/History";
import NotFound from "./components/NotFound";

function info(component, path) {
  return { component, path };
}

const views = {
  abbreviations: info(Abbreviations, "/"),
  list: info(AbbreviationList, "/list"),
  about: info(About, "/about"),
  history: info(History, "/history"),
  notFound: info(NotFound, "*")
};

const router = (
  <BrowserRouter>
    <Switch>
      <Route exact path={views.abbreviations.path} component={views.abbreviations.component}/>
      <Route path={views.list.path} component={views.list.component}/>
      <Route path={views.about.path} component={views.about.component}/>
      <Route path={views.history.path} component={views.history.component}/>
      <Route path={views.notFound.path} component={views.notFound.component}/>
    </Switch>
  </BrowserRouter>
);

export { router, views };
