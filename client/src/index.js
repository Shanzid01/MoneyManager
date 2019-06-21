import React from 'react';
import ReactDom from 'react-dom';
import App from './containers/app';
import Statistics from './containers/stats';
import Auth from './containers/auth';
import UserAccount from './containers/userAccount';
import {BrowserRouter, Route} from 'react-router-dom';
import Welcome from './components/welcome';

ReactDom.render(
    <BrowserRouter>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/app" component={App} />
        <Route exact path="/auth" component={Auth} />
        <Route path="/settings" component={UserAccount} />
        <Route exact path="/privacy" render={() => {window.location.href="PrivacyPolicy.html"}} />
        <Route exact path="/terms" render={() => {window.location.href="terms_and_conditions.html"}} />
        <Route path="/statistics" component={Statistics} />
    </BrowserRouter>
   , document.getElementById('root')
);