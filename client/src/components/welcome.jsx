import React, {Component} from 'react';
import '../styles/welcome.css';

export default class Welcome extends Component{
    render(){return(
        <div>
            <div class="bg-welcome"></div>
            <div class="app-logo-welcome"></div>
            <div class="menu-welcome">
                <span class="menu-item-welcome"><a href="./app">Login/Register</a></span>
                <span class="menu-item-welcome"><a href="https://play.google.com/store/apps/details?id=com.shanzid.moneymanager">Download for Android</a></span>
                <span class="menu-item-welcome"><a href="https://shanzid.com">Contact developer</a></span>
                <span class="menu-item-welcome"><a href="https://github.com/Shanzid01/MoneyManager">Source code</a></span>
            </div>
            <div class="heading-welcome">
                <span class="app-title-welcome">MoneyManager</span>
                <span class="app-motto-welcome">Take control of your finances</span>
                <div class="cta-buttons-welcome">
                    <a href="./app" class="waves-effect waves-light btn blue z-depth-0">Join us</a>
                </div>
            </div>
        </div>
    )};
}