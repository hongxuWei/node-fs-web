import React, { useState } from "react";
import Layout from "./Layout";
import { Switch, Route } from "react-router-dom";
import { GLOBAL_CONTEXT } from './utils/context';

import Home from './pages/FileList';
import Dir from './pages/Dir';
import "./App.css";

function App() {
  const [global, setGlobal] = useState({});
  const updateGlobal = (key, value) => {
    setGlobal({
      ...global,
      [key]: value,
    });
  };

  return (
    <div className="App">
      <Layout>
        <GLOBAL_CONTEXT.Provider value={{ data: global, updateGlobal }}>
          <Switch>
            <Route path="/dir/:dirId" component={Dir} />
            <Route path="/about" component={() => <div>about</div>} />
            <Route path="/" component={Home} />
          </Switch>
        </GLOBAL_CONTEXT.Provider>
      </Layout>
    </div>
  );
}

export default App;
