import React, {Component} from 'react';
import Navbar from '../components/navbar';
import NewEntry from '../components/newEntry';
import ExchangeItem from '../components/exchangeItem';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import '../styles/global.css';
import axios from 'axios';
import Loader from '../helpers/preloader';
import M from 'materialize-css';
import AccountSummary from '../components/accountSummary';
import '../styles/app.css';
import {firebaseApp} from '../helpers/firebase';
import CloudFunctionURL from '../helpers/constants';
import Footer from '../components/footer';

class App extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            isLoading:false,
            currentAccount:'Cash',
            accounts:['Cash'],
            user:{}
        }
    }
    removeExchange(id){
        this.setState({
            data: this.state.data.filter(item => item._id !==id)
        });
    }
    addNewExchange(item){
        let {data} = this.state;
        data.push(item);
        data.sort((a,b)=>{
            return new Date(b.date) - new Date(a.date);
        });
        this.setState({data:data});
    }
    componentDidMount(){
        let context=this;
        this.setState({isLoading:true});
        firebaseApp.auth().onAuthStateChanged(function(user) {
            if (user) {
                if(!user.photoURL || user.photoURL.length===0){
                    user.updateProfile({
                        photoURL: '{"name":"US Dollar","symbol":"$"}'
                    }).then(()=>{
                        context.setState({user});
                    })
                }else{
                    context.setState({user});
                }
                user.getIdToken(true).then(function(idToken) {
                    axios.defaults.headers.common['UserToken']=idToken;
                    axios.get(CloudFunctionURL+'api/exchanges/accounts')
                    .then(res=>{
                        let accounts=['Cash']
                        if(res.data && res.data.length>0){
                            accounts=res.data;
                        }
                        context.setState({accounts, currentAccount:accounts[0]})
                        context.getData();
                    }).catch(error=>{
                        M.toast({html:error});
                    })
                }).catch(error=>{
                    M.toast({html: error});
                    context.props.history.push('/auth');
                });
            }else {
                context.props.history.push('/auth');
            }
        });
    }
    getData(){
        this.setState({isLoading:true, data:[]});
        let params={'account':this.state.currentAccount};
        axios.get(CloudFunctionURL+'api/exchanges', {params})
            .then(res =>{
                let data=res.data;
                data.sort((a,b)=>{
                    return new Date(b.date) - new Date(a.date);
                });
                this.setState({data});
                this.setState({isLoading:false});
            }).catch(error =>{
                M.toast({html: error});
                this.setState({isLoading:false});
            })
    }
    createNewAccount(accountName){
        let accounts=this.state.accounts;
        accounts.push(accountName);
        this.setState({accounts});
        this.setState({currentAccount:accountName});
    }
    changeCurrentAccount(account){
        this.setState({currentAccount:account});
    }
    componentDidUpdate(prevProps, prevState){
        if(this.state.currentAccount!==prevState.currentAccount){
            this.getData();
        }
    }
    render(){return(
        <div>
         <Navbar/>
         <NewEntry currentAccount={this.state.currentAccount} newExchange={(item)=>{this.addNewExchange(item)}}
              shouldPulse={this.state.data.length===0 && !this.state.isLoading? true:false} />
         <AccountSummary user={this.state.user} accData={this.state.data} currentAccount={this.state.currentAccount} accounts={this.state.accounts}
            createNewAccount={(account)=>this.createNewAccount(account)}
            changeAccount={(account)=>this.changeCurrentAccount(account)} />
         <div className="container">
         {this.state.isLoading? <Loader specialClass="exchanges-loader" />:null}
         <TransitionGroup>
         {
             this.state.data.map(item=>(
                <CSSTransition key={item._id} classNames="fade" timeout={150}>
                    <ExchangeItem user={this.state.user} data={item} deleteItem={(id)=>this.removeExchange(id)} />
                </CSSTransition>
             ))
         }
         </TransitionGroup>
         {
            this.state.data.length===0 && !this.state.isLoading? 
                <div className="empty-list-alert">
                    <div>No data<br/><i className="material-icons">short_text</i></div>
                </div>:null
         }
         </div>
         <Footer />
        </div>
    )}
}
export default App;