import React, {Component} from 'react';
import {firebaseApp} from '../helpers/firebase';
import M from 'materialize-css';
import '../styles/signin.css';
import Loader from '../helpers/preloader';
import firebase from 'firebase';

class SignIn extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false
        }
    }
    login(){
        let user_email=document.getElementById('email-input').value;
        let user_pwd=document.getElementById('password-input').value;
        if(user_email.length>0 && user_pwd.length>0){
            this.setState({isLoading:true});
            firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(()=> {
                firebaseApp.auth().signInWithEmailAndPassword(user_email, user_pwd)
                .catch(()=>{
                M.toast({html: 'Login failed'});
                this.setState({isLoading:false});
                return;
                });
            });
        }
    }
    render(){
        return(
            <div className="container signin-container">
                <div className="app-title">MoneyManager</div>
                <div className="signin-form z-depth-4">
                <div className="login-title">Login</div>
                <br></br>
                <div className="row">
                    <div className="col s12 text-field">
                        <div className="input-field">
                            <input id="email-input" type="email" required className="validate col s12" disabled={this.state.isLoading} />
                            <label htmlFor="email-input">Email</label>
                        </div>
                    </div>
                    <div className="col s12 text-field">
                         <div className="input-field">
                            <input id="password-input" type="password" required className="validate col s12" disabled={this.state.isLoading} />
                            <label htmlFor="password-input">Password</label>
                        </div>
                    </div>
                    <div className="col s12 center text-field">
                    {this.state.isLoading? <Loader specialClass="float-fix signin-loader" />:
                        <span id="login-btn" onClick={()=>this.login()} 
                        className="btn login-btn z-depth-0 waves-effect waves-light" >Login
                        </span>
                    }
                    </div>
                    <div className="col s12 center text-field">
                        <span className="redirect-link" onClick={()=>this.props.toggleForm('up')}>Register instead</span>
                        <span style={{'color': '#546E7A'}}>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
                        <span className="redirect-link" onClick={()=>this.props.toggleForm('forgot')}>Forgot password?</span>
                    </div>
                </div>
                </div>
            </div>
        )
    };
}
export default SignIn;