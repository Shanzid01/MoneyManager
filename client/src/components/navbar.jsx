import React, {Component} from 'react';
import M from 'materialize-css';
import '../styles/navbar.css';
import {Link} from 'react-router-dom';
import '../styles/userinfo.css';
import {firebaseApp} from '../helpers/firebase';

class Navbar extends Component{
    constructor(props){
        super(props);
        this.state={
            user:{emailVerified:true}
        }
    }
    componentDidMount(){
        this.initializeItems();
    }
    initializeItems(){
        M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
            coverTrigger:false,
            constrainWidth:false,
            closeOnClick:false,
            autoTrigger:false
        });
    }
    componentWillMount(){
        let context=this;
        firebaseApp.auth().onAuthStateChanged(function(user) {
            if (user) {
                context.setState({user})
            }
        });
    }
    signout(){
        firebaseApp.auth().signOut();
    }
    render(){return(
        <div className="navbar-fixed">
            <nav className="z-depth-0 blue">
                <div className="nav-wrapper container">
                <Link to={'/app'} className="logo">MoneyManager</Link>
                {/* <span data-target="mobile-sidenav" className="sidenav-trigger hide-on-large-only"><i className="material-icons">menu</i></span> */}
                <ul className="right menu-container">
                    <li>
                        <Link to={'/statistics'} className={"waves-effect waves-light z-depth-0 transparent menu-options "}>
                            <i className="material-icons left">equalizer</i>
                            <span className="hide-on-small-only menu-label">Money Statistics</span>
                        </Link>
                    </li>
                    <li>
                        <a href="#!" data-target='user-info' className={"waves-effect dropdown-trigger waves-light menu-options transparent z-depth-0"}>
                            <i className="material-icons left">person</i>
                            <span className="hide-on-small-only">Account</span>
                        </a>
                    </li>
                </ul>
                </div>
                <div id='user-info' className='dropdown-content z-depth-4'>
                    <div className="user-info-container">
                       <div className="user-tag-container">
                           <div className="user-icon">
                                <i className="material-icons">person</i>
                           </div>
                           <div className="user-info">
                                <span className="user-name">{this.state.user.displayName}</span><br />
                                <span className={"user-email "+(this.state.user.emailVerified? '':'orange-text')}>{this.state.user.email}</span>
                                <br/>{this.state.user.emailVerified? '':<div className="unverified-alert"><i className="material-icons">report</i>Unverified email</div>}
                           </div>
                       </div>
                       <div className="user-button-container">
                            <a style={{'marginLeft':'0px'}} href="/settings" className="btn transparent z-depth-0 waves-effect"><i className="material-icons left">settings</i>Settings</a>
                            <span onClick={()=> this.signout()} className="btn transparent z-depth-0 waves-effect sign-out"><i className="material-icons left">last_page</i>Sign out</span>
                       </div>
                    </div>
                </div>
            </nav>
            {/* <ul className="sidenav z-depth-0 sidenav-fixed" id="mobile-sidenav">
                <li><Link to={'/app'} className="waves-effect"><i className="material-icons">home</i>Dashboard</Link></li>
                <li><Link to={'/statistics'} className="waves-effect"><i className="material-icons">equalizer</i>Statistics</Link></li>
                <li><Link to={'/'} className="waves-effect"><i className="material-icons">person</i>My Account</Link></li>
            </ul> */}
        </div>
    )}
}
export default Navbar;