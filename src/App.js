import React, { useState } from "react";
import Layout from "./Layout";
import { Switch, Route, Redirect } from "react-router-dom";
import { GLOBAL_CONTEXT } from './utils/context';
import CustomerContextMenu from './components/CustomerContextMenu';
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
      <GLOBAL_CONTEXT.Provider value={{ data: global, updateGlobal }}>
        <Layout>
          <Switch>
            <Route path="/dir/:dirId" component={Dir} />
            <Route path="/trash/:dirId" component={(props) => <Dir {...props} trash key="trash"/>} />
            <Redirect from="/" to="/dir/0" exact/>
          </Switch>
        </Layout>
        <CustomerContextMenu />
      </GLOBAL_CONTEXT.Provider>
    </div>
  );
}

export default App;
