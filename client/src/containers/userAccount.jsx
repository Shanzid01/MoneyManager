import React, {Component} from 'react';
import Navbar from '../components/navbar';
import {firebaseApp} from '../helpers/firebase';
import M from 'materialize-css';
import '../styles/userAccount.css';
import Loader from '../helpers/preloader';
import Currencies from '../helpers/currencyList';
import Footer from '../components/footer';

export default class Account extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false,
            user:{emailVerified:true},
        }
    }
    componentDidMount(){
        let context=this;
        this.setState({isLoading:true});
        firebaseApp.auth().onAuthStateChanged(function(user) {
            if (user) {
                context.setState({user});
                document.getElementById('currency-select').value=user.photoURL;
                context.setState({isLoading:false});
            }else {
                context.props.history.push('/auth');
            }
        });
        this.initializeItems();
    }
    initializeItems(){
        M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
        M.FormSelect.init(document.querySelectorAll('select'), {});
    }
    changeNameEmail(){
        let nameInput=document.getElementById('new-name').value;
        let emailInput=document.getElementById('new-email').value;
        let user = firebaseApp.auth().currentUser;
        let context=this;
        if(nameInput && nameInput.length>0){
            this.setState({isLoading:true});
            user.updateProfile({
                displayName: nameInput
            }).then(function() {
                context.setState({isLoading:false});
                document.getElementById('new-name').value='';
            }).catch(function(err) {
                console.log(err);
                M.toast({html: 'Error when updating name'});
                context.setState({isLoading:false});
            });
        }
        if(emailInput && emailInput.length>0){
            this.setState({isLoading:true});
            user.updateEmail(emailInput).then(function() {
                context.setState({isLoading:false});
                document.getElementById('new-email').value='';
              }).catch(function(err) {
                console.log(err);
                M.toast({html: 'Error when updating email: '+err.message});
                context.setState({isLoading:false});
              });
        }
    }
    changePassword(){
        let passInput=document.getElementById('new-password').value;
        let user = firebaseApp.auth().currentUser;
        let context=this;
        if(passInput && passInput.length>0){
            this.setState({isLoading:true});
            user.updatePassword(passInput).then(function() {
                context.setState({isLoading:false});
                document.getElementById('new-password').value='';
                M.toast({html:'Password updated successfully'});
              }).catch(function(err) {
                console.log(err);
                M.toast({html: 'Error when updating password: '+err.message});
                context.setState({isLoading:false});
              });
        }
    }
    deleteUser(){
        let user = firebaseApp.auth().currentUser;
        let context=this;
        this.setState({isLoading:true});
        user.delete().then(function() {
            context.setState({isLoading:false});
        }).catch(function(err) {
            context.setState({isLoading:false});
            M.toast({html: 'Error when deleting account: '+err.message});
        });
    }
    sendEmailVerification(){
        let user = firebaseApp.auth().currentUser;
        user.sendEmailVerification().then(function() {
            M.toast({html:'Request sent. Please check your email'});
        }).catch(function(err) {
            M.toast({html:'Error: '+err});
        });
    }
    saveCurrency(){
        let user = firebaseApp.auth().currentUser;
        let context=this;
        let prevCurrency=this.state.user.photoURL;
        let e = document.getElementById("currency-select");
        let currency=e.options[e.selectedIndex].value;
        if(prevCurrency !== currency){
            this.setState({isLoading:true});
            user.updateProfile({
                photoURL: currency
            }).then(function() {
                context.setState({isLoading:false});
                console.log(context.state.user.photoURL);
                M.toast({html: 'Default currency updated'});
            }).catch(function(err) {
                console.log(err);
                M.toast({html: 'Error when updating currency'});
                context.setState({isLoading:false});
            });
        }
    }
    render(){
        return(
        <div>
            <Navbar />
            <div className="container">
                <div className="user-basic-container">
                    <div className="user-image">
                        <i className="material-icons">person</i>
                    </div>
                    <div>
                        <span className="userinfo-name">{this.state.user.displayName}</span>
                        <span className={"userinfo-email "+(this.state.user.emailVerified? '':'orange-text')}>
                            {this.state.user.emailVerified? '':<i className="material-icons orange-text">report</i>}
                            {this.state.user.email}
                        </span>
                        {this.state.user.emailVerified? '':<a href="#!" onClick={()=>this.sendEmailVerification()} className="email-verification-link">Send verification email</a>}
                    </div>
                </div>
            </div>
            <div className="container">
                <ul className="collapsible">
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons right">assignment_ind</i>
                            Change name & email
                        </div>
                        <div className="collapsible-body">
                            <div className="row">
                                <div className="input-field col s9">
                                    <input id="new-name" type="text" className="validate" disabled={this.state.isLoading} />
                                    <label htmlFor="new-name">Name</label>
                                </div>
                                <div className="input-field col s9">
                                    <input id="new-email" type="email" className="validate" disabled={this.state.isLoading} />
                                    <label htmlFor="new-email">Email</label>
                                </div>
                                <div className="input-field col s12">
                                    <span onClick={()=>this.changeNameEmail()} className={"btn user-save-btn z-depth-0 waves-effect "+(this.state.isLoading? 'disabled':'')}>
                                        {this.state.isLoading?
                                        <Loader specialClass="user-save-btn-loader" />:
                                        'Save'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons right">vpn_key</i>
                            Change password
                        </div>
                        <div className="collapsible-body">
                        <div className="row">
                                <div className="input-field col s9">
                                    <input id="new-password" type="password" className="validate" disabled={this.state.isLoading} />
                                    <label htmlFor="new-password">New password</label>
                                </div>
                                <div className="input-field col s12">
                                    <span onClick={()=>this.changePassword()} className={"btn user-save-btn z-depth-0 waves-effect "+(this.state.isLoading? 'disabled':'')}>
                                        {this.state.isLoading?
                                        <Loader specialClass="user-save-btn-loader" />:
                                        'Save'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons right">attach_money</i>
                            Change default currency
                        </div>
                        <div className="collapsible-body">
                        <div className="row">
                                <div className="input-field col s12">
                                    <select id="currency-select" className="browser-default">
                                        {Currencies.map((item, key)=>{
                                            return <option key={key}
                                            value={JSON.stringify(item)}>{item.name} ({item.symbol})</option>
                                        })}
                                    </select>
                                </div>
                                <div className="input-field col s12">
                                    <span onClick={()=>this.saveCurrency()} className={"btn user-save-btn z-depth-0 waves-effect "+(this.state.isLoading? 'disabled':'')}>
                                        {this.state.isLoading?
                                        <Loader specialClass="user-save-btn-loader" />:
                                        'Save'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header">
                            <i className="material-icons right">info</i>
                            Help center
                        </div>
                        <div className="collapsible-body">
                            <span className="user-message">
                                Have a question?&nbsp;
                                <b><a href="mailto: hello@shanzid.com">Send us an email</a></b>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div className="collapsible-header red-text">
                            <i className="material-icons right">delete_forever</i>
                            Delete account
                        </div>
                        <div className="collapsible-body">
                            <span className="user-message">
                                This will <b>permanently</b> delete your MoneyManager account.
                                Are you sure you want to continue?
                            </span>
                            <span onClick={()=>this.deleteUser()} className={"btn z-depth-0 red waves-effect user-delete-btn "+(this.state.isLoading? 'disabled':'')}>I understand, goodbye</span>
                        </div>
                    </li>
                </ul>
            </div>
            <Footer />
        </div>
    )}
}