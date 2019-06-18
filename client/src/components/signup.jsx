import React, {Component} from 'react';
import {firebaseApp} from '../helpers/firebase';
import M from 'materialize-css';
import '../styles/global.css';
import '../styles/signin.css';
import Loader from '../helpers/preloader';
import firebase from 'firebase';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false
        }
    }
    signup(){
        let user_name=document.getElementById('name-input').value;
        let user_email=document.getElementById('email-input').value;
        let user_pwd=document.getElementById('password-input').value;
        if(user_email.length>0 && user_pwd.length>0 && user_name.length>0){
            this.setState({isLoading:true});
            this.setState({userName:user_name});
            firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(()=> {
                firebaseApp.auth().createUserWithEmailAndPassword(user_email, user_pwd)
                .catch(()=>{
                M.toast({html: 'Registration failed'});
                return;
                });
            });
        }
    };
    componentWillMount(){
        let appContext=this;
        firebaseApp.auth().onAuthStateChanged((user) =>{
            if(user){
                console.log(appContext.state.userName)
                firebaseApp.auth().currentUser.updateProfile({
                    displayName:appContext.state.userName
                }).then(function() {
                    appContext.setState({isLoading:false});
                    appContext.props.history.push('/app');
                }).catch((err)=>{
                    console.log(err)
                    appContext.setState({isLoading:false});
                });
            }
        });
    }
    render(){
        return(
            <div className="container signin-container">
                <div className="app-title">MoneyManager</div>
                <div className="signin-form z-depth-4">
                <div className="login-title register-title">Register</div>
                <br></br>
                <div className="row">
                    <div className="text-field col s12">
                        <div className="input-field">
                            <input id="name-input" type="text" required className="validate text-field col s12" disabled={this.state.isLoading} />
                            <label htmlFor="name-input">Name</label>
                        </div>
                    </div>
                    <div className="text-field col s12">
                        <div className="input-field">
                            <input id="email-input" type="email" required className="validate text-field col s12" disabled={this.state.isLoading} />
                            <label htmlFor="email-input">Email</label>
                        </div>
                    </div>
                    <div className="text-field col s12">
                         <div className="input-field">
                            <input id="password-input" type="password" required className="validate text-field col s12" disabled={this.state.isLoading} />
                            <label htmlFor="password-input">Password</label>
                        </div>
                    </div>
                    <div className="text-field col s12 center">
                    {this.state.isLoading? <Loader specialClass="float-fix signin-loader" />:
                        <span id="login-btn" onClick={()=>this.signup()} 
                        className="btn blue login-btn z-depth-0 waves-effect waves-light" >Submit
                        </span>
                    }
                    </div>
                    <div className="text-field col s12 center">
                        <span className="redirect-link" onClick={()=>this.props.toggleForm()} >Login instead</span>
                    </div>
                </div>
                </div>
            </div>
        )
    };
}

export default SignUp;