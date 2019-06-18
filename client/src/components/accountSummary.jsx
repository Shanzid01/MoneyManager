import React, {Component} from 'react';
import '../styles/accountSummary.css';
import M from 'materialize-css';

class AccountSummary extends Component{
    constructor(props){
        super(props);
        this.state={
            balance:0,
            balanceDecimal:'.00'
        }
    }
    calculateBalance(){
        let incomes=0;
        let expenses=0;
        for(let i in this.props.accData){
            if(this.props.accData[i].type==="Expense"){
                expenses+=Number(this.props.accData[i].amount);
            }else{
                incomes+=Number(this.props.accData[i].amount);
            }
        }
        this.setState({
            balance:parseFloat(incomes-expenses).toFixed(0),
            balanceDecimal:(Number(parseFloat((incomes-expenses)%1)).toFixed(2)).substr(1, 4)
        });
    }
    initializeComponents(){
        M.Dropdown.init(document.querySelectorAll('.account-dropdown'), {
            constrainWidth:false,
            alignment:'right',
            inDuration:150,
            outDuration:150
        });
    }
    componentDidMount(){
        this.initializeComponents();
    }
    componentDidUpdate(prevProps){
        if(this.props.accData!==prevProps.accData){
            this.calculateBalance();
        }
    }
    componentWillReceiveProps(){
        this.calculateBalance();
        this.setState({
            currentAccount: this.props.currentAccount,
            accounts: this.props.accounts
        })
    }
    changeAccount(account){
        if(this.props.currentAccount!==account){
            this.props.changeAccount(account);
        }
    }
    createNewAccount(){
        let accountName=prompt("New account name");
        if(!accountName){return}
        this.props.createNewAccount(accountName);
    }
    render(){return(
        <div className="sub-nav-container">
        <div className="blue parent-content">
            <div className="account-selection">
                <span className='dropdown-trigger account-dropdown' data-target='dropdown1'>{this.props.currentAccount} <i className="material-icons">expand_more</i></span>
                <ul id='dropdown1' className='dropdown-content'>
                    <li className="disabled"><span>Choose an account</span></li>
                    {this.props.accounts.map((item, key)=>{
                        return <li key={key}><span onClick={()=>this.changeAccount(item)}>{item}</span></li>
                    })}
                    <li><span onClick={()=>this.createNewAccount()}>Create new<i className="material-icons right">add</i></span></li>
                </ul>
            </div>
            <div className="account-balance">
                <div className="balance-text">
                    <span className="dollar">{this.props.user.photoURL? JSON.parse(this.props.user.photoURL).symbol : ''}</span>
                    {this.state.balance}
                    <span className="balance-decimal">{this.state.balanceDecimal}</span>
                </div>
            </div>
        </div>
        </div>
    )};
}

export default AccountSummary;