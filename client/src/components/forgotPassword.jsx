import React, {Component} from 'react';
import Loader from '../helpers/preloader';
import { firebaseApp } from '../helpers/firebase';
import M from 'materialize-css';

export default class ForgotPassword extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false
        }
    }
    sendPasswordReset(){
        this.setState({isLoading:true});
        let auth = firebaseApp.auth();
        let context=this;
        let emailAddress = document.getElementById('email-input').value;
        if(emailAddress && emailAddress.length>0){
            auth.sendPasswordResetEmail(emailAddress).then(function() {
                M.toast({html:'Password reset link sent to '+emailAddress});
                context.setState({isLoading:false});
            }).catch(function(err) {
                M.toast({html:'Error: '+err.message});
                context.setState({isLoading:false});
            });
        }
    }
    render(){return(
        <div className="container signin-container">
            <div className="app-title">MoneyManager</div>
            <div className="signin-form z-depth-4">
            <div className="login-title">Password reset</div>
            <br></br>
            <div className="row">
                <div className="col s12 text-field">
                    <div className="input-field">
                        <input id="email-input" type="email" required className="validate col s12" disabled={this.state.isLoading} />
                        <label htmlFor="email-input">Your registered Email</label>
                    </div>
                </div>
                <div className="col s12 center text-field">
                {this.state.isLoading? <Loader specialClass="float-fix signin-loader" />:
                    <span id="login-btn" onClick={()=>this.sendPasswordReset()} 
                    className="btn login-btn z-depth-0 waves-effect waves-light recovery-btn" >Send recovery email
                    </span>
                }
                </div>
                <div className="col s12 center text-field">
                    <span className="redirect-link"  onClick={()=>this.props.toggleForm('up')}>Register instead</span>
                </div>
            </div>
            </div>
        </div>
    )};
}