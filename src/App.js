import React from "react";
import Layout from "./Layout";
import { Switch, Route } from "react-router-dom";

import Home from './pages/FileList';
import Dir from './pages/Dir';
import "./App.css";

function App() {
  return (
    <div className="App">
      <Layout>
        <Switch>
          <Route path="/dir/:dirId" component={Dir} />
          <Route path="/about" component={() => <div>about</div>} />
          <Route path="/" component={Home} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
