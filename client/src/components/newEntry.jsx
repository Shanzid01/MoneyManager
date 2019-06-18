import React, {Component} from 'react';
import M from 'materialize-css';
import '../styles/newEntry.css';
import axios from 'axios';
import firebaseApp from 'firebase';
import Loader from '../helpers/preloader';
import CloudFunctionURL from '../helpers/constants';

class NewEntry extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false
        }
    }
    componentDidMount(){
        this.initializeFields();
    }
    initializeFields(){
        M.FormSelect.init(document.querySelectorAll('select'), {});
        M.Modal.init(document.querySelectorAll('.modal'), {});
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            defaultDate:new Date(),
            setDefaultDate:true,
            maxDate: (new Date())
        });
        initChips();
        function initChips(data=[]){
            let autoCompleteData={
                'Food': null,
                'Utility bill': null,
                'Rent': null,
                'Pet food':null,
                'Clothes':null,
                'Hobby':null,
                'Loan payment':null,
                'Mortgage':null,
                'Salary':null,
                'Interest':null,
                'Bills':null,
                'Business':null,
                'Tax':null
            };
            for(let index in data){
                autoCompleteData[data[index]]=null;
            }
            M.Chips.init(document.querySelectorAll('.chips'), {
                placeholder: 'Category',
                secondaryPlaceholder: ' ',
                limit:1,
                autocompleteOptions: {
                    data: autoCompleteData,
                    limit: 2,
                    minLength: 1
                  }
            });
        }
        firebaseApp.auth().onAuthStateChanged(function(user) {
            if (user) {
                user.getIdToken(true).then(function(idToken) {
                    axios.get(CloudFunctionURL+'api/exchanges/categories', {headers:{'UserToken':idToken}})
                        .then(res=>{
                            initChips(res.data);
                        }).catch(()=>{
                            M.toast({html: 'Error getting data for categories'});
                        });
                }).catch(()=>{
                    M.toast({html: 'Error getting user token'});
                });
            }
        });
    }
    validateForm(){
        this.setChips();
        if(document.querySelector('form').reportValidity()){
            this.submitForm();
        }
    }
    setChips(){
        document.getElementById('chip-input').dispatchEvent(new KeyboardEvent("keydown", {
            bubbles: true, cancelable: true, keyCode: 13
        }));
    }
    submitForm(){
        let selectedChip=null;
        try{
            selectedChip=M.Chips.getInstance(document.getElementsByClassName('chips')[0]).chipsData[0].tag;
        }catch(err){
            console.log(err);
            selectedChip=null;
        }
        let data={
            type:document.querySelector('input[name="entry-type"]:checked').value,
            name:document.getElementById('exchange-name').value,
            amount:document.getElementById('exchange-amount').value,
            details:document.getElementById('exchange-details').value,
            date:document.getElementById('exchange-date').value,
            category:selectedChip,
            account: this.props.currentAccount
        }
        this.setState({isLoading:true});
        axios.post(CloudFunctionURL+'api/exchanges', data)
            .then((res)=>{
                this.setState({isLoading:false});
                M.Chips.getInstance(document.querySelectorAll('.chips')[0]).deleteChip(0);
                document.getElementById("entry-form").reset();
                this.props.newExchange(res.data);
                this.closeModal();
                this.initializeFields();
            }).catch(error=>{
                M.toast({html: error});
                this.setState({isLoading:false});
            });
    }
    closeModal(){
        M.Modal.getInstance(document.querySelectorAll('.modal')[0]).close();
    }
    render(){return(
    <div>
        <div className="fixed-action-btn">
            <a className={"btn-floating btn-large z-depth-2 indigo waves-effect waves-light modal-trigger "+(this.props.shouldPulse? 'pulse':'')} href="#new-entry-modal">
                <i className="large material-icons">add</i>
            </a>
        </div>
        <div id="new-entry-modal" className="modal bottom-sheet">
            <div className="modal-content">
                <div className="modal-header-container">
                    <span className="modal-header-title">Add new transaction</span>
                    <i className="material-icons right close-modal-icon" onClick={this.closeModal}>clear</i>
                </div>
                <div>
                    <form id="entry-form" onSubmit={(e)=>{e.preventDefault(); return false;}}>
                    <label className="entry-type entry-income">
                        <input name="entry-type" value="Income" required type="radio" />
                        <span>Income</span>
                    </label>
                    <label className="entry-type entry-expense">
                        <input name="entry-type" value="Expense" required type="radio" />
                        <span>Expense</span>
                    </label>
                    <div className="row text-inputs">
                        <div className="input-field col s12">
                            <input id="exchange-name" type="text" required className="validate" />
                            <label className="active" htmlFor="exchange-name">Title</label>
                        </div>
                        <div className="input-field col s12">
                            <input id="exchange-amount" step="0.01" type="number" required className="validate" />
                            <label htmlFor="exchange-amount">Amount</label>
                        </div>
                        <div className="input-field col s12">
                            <textarea id="exchange-details" className="materialize-textarea"></textarea>
                            <label htmlFor="exchange-details">Details</label>
                        </div>
                        <div className="input-field col s12 chip-input-container">
                            <div className="chips chips-autocomplete">
                                <input id="chip-input" />
                            </div>
                        </div>
                        <div className="input-field col s12">
                            <input id="exchange-date" type="text" className="datepicker" />
                        </div>
                    </div>
                    <span 
                        className={'btn save-exchange-btn teal white-text z-depth-0 waves-effect waves-light '+(this.state.isLoading? 'disabled':'')}
                        onClick={()=>this.validateForm()}>
                            {this.state.isLoading? <Loader specialClass="save-loader" />: 'Save'}
                        </span>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )}
}
export default NewEntry;