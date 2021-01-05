import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "./App.css";
// Material UI Core
import CssBaseline from "@material-ui/core/CssBaseline";

// Components
import Header from "../Header";
import Footer from "../Footer";
import DashBoard from "../../../feature/Main/DashBoard/index";
import LogIn from "../../../feature/Authentication/LogIn/index";
import SignUp from "../../../feature/Authentication/SignUp/index";
import Profile from "../../../feature/Profile/index";
import Loading from "../Loading";
import createHashHistory from "history/createHashHistory";
import { SocketStateProvider } from "../../../context/socket-context";
import { LoadingStateProvider } from "../../../context/loading-context";
import Game from "../../../feature/Main/Game";
import AccountValidation from "../../../feature/Authentication/AccountValidation";
import ResetPassword from "../../../feature/Authentication/ResetPassword";
import ForgetPassword from "../../../feature/Authentication/ForgetPassword";
import History from "../../../feature/History";
import Reconnect from "../../../feature/Main/Reconnect";
import Spectator from "../../../feature/Main/Spectator";
import { initializeAPIService } from "../../../services/api/base-api";
import { config } from "../../../config";

//const hashHistory = createHashHistory({ basename: process.env.PUBLIC_URL });

function App() {
  initializeAPIService();

  return (
    <SocketStateProvider>
      <LoadingStateProvider>
        <React.Fragment>
          <CssBaseline />
          <Loading />
          <Router /*history={hashHistory} basename={process.env.PUBLIC_URL} */>
            <Switch>
              <Route path={config.route.login}>
                {/* Header */}
                <Header />
                <LogIn />
              </Route>
              <Route path={config.route.signup}>
                {/* Header */}
                <Header />
                <SignUp />
              </Route>
              <Route path={config.route.profile}>
                {/* Header */}
                <Header />
                <Profile />
              </Route>
              <Route path={config.route.dashboard}>
                <Reconnect/>
                {/* Header */}
                <Header />
                {/* End Header */}
                <DashBoard />
                {/* Footer */}
                <Footer />
                {/* End footer */}
              </Route>
              <Route path={config.route.game}>
                {/*<Header />*/}
                <Game />
              </Route>
              <Route path={config.route.spectatorPath}>
                {/*<Header />*/}
                <Spectator />
              </Route>
              <Route path={config.route.historyGame}>
                <History />
              </Route>
              <Route path={config.route.accountValidate}>
                <Header />
                <AccountValidation />
              </Route>
              <Route path={config.route.forgotPassword}>
                <Header />
                <ForgetPassword />
              </Route>
              <Route path={config.route.resetPasswordPath}>
                <Header />
                <ResetPassword />
              </Route>
              <Route path={config.route.root}>
                <Redirect to={config.route.login} />
              </Route>
            </Switch>
          </Router>
        </React.Fragment>
      </LoadingStateProvider>
    </SocketStateProvider>
  );
}

export default App;
