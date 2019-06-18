import React, {Component} from 'react';
import '../styles/exchangeItem.css';
import M from 'materialize-css';
import Date from '../helpers/date';
import axios from 'axios';
import Loader from '../helpers/preloader';
import CloudFunctionURL from '../helpers/constants';

class ExchangeItem extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false
        }
    }
    componentDidMount(){
        M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
    }
    deleteExchange(){
        let context=this;
        this.setState({isLoading:true});
        axios.delete(CloudFunctionURL+'api/exchanges?id='+this.props.data._id)
            .then((res)=>{
                console.log('deleted', res);
                this.setState({isLoading:false});
                context.props.deleteItem(this.props.data._id);
            }).catch(error=>{
                M.toast({html: error});
                this.setState({isLoading:false});
            });
    }
    render(){return(
        <ul className="collapsible popout">
             <li>
            <div className="collapsible-header">
                <div>
                    <span className="exchange-title">{this.props.data.name}</span>
                    <div className="exchange-date">{Date.parseDate(this.props.data.date)}</div>
                </div>
                <span className={"amount-text "+ (this.props.data.type==='Income'? 'green-text':'red-text')}>
                    <span className="dollar-symbol">
                    {this.props.user.photoURL? JSON.parse(this.props.user.photoURL).symbol : ''}
                    </span>{this.props.data.amount}
                </span>
            </div>
            <div className="collapsible-body">
                <div className="exchange-details">
                    {this.props.data.details}
                </div>
                <div style={{display:'flex'}}>
                    <span className="exchange-category">
                        {this.props.data.type==='Expense'? 
                        <i className="material-icons right red-text">remove_circle</i>: 
                        <i className="material-icons right green-text">add_circle</i>}
                        {this.props.data.category}
                    </span>
                    <span className="exchange-type">
                        {this.props.data.type}
                    </span>
                    {(()=>{
                        if(this.state.isLoading){
                            return <Loader specialClass="delete-btn-loader" />
                        }else{
                           return (<span onClick={()=>this.deleteExchange()} className="btn transparent waves-effect delete-btn z-depth-0">
                                    <i className="material-icons left">delete</i>
                                    Delete
                                  </span>)
                        }
                    })()}
                </div>
            </div>
            </li>
        </ul>
    )};
}

export default ExchangeItem;