import React, {Component} from 'react';
import SignIn from '../components/signin';
import SignUp from '../components/signup';
import ForgotPassword from '../components/forgotPassword'
import {firebaseApp} from '../helpers/firebase';
import Footer from '../components/footer';

class Auth extends Component{
    constructor(props){
        super(props);
        this.state={
            activeForm:'in'
        }
    }
    componentWillMount(){
        firebaseApp.auth().onAuthStateChanged((user) =>{
            if(user){
                this.props.history.push('/app');
            }
        });
    }
    render(){ 
        return(
        <div>
            {this.state.activeForm==='in'? 
                <SignIn toggleForm={(q)=>this.setState({activeForm: q})} />: 
                (this.state.activeForm==='up'? 
                <SignUp toggleForm={()=>this.setState({activeForm: 'in'})}/>:
                <ForgotPassword toggleForm={(q)=>this.setState({activeForm: q})} />)}
            <Footer />
        </div>
    )};
}

export default Auth;