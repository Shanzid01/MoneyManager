import React, {Component} from 'react';
import Navbar from '../components/navbar';
import '../styles/global.css';
import axios from 'axios';
import { Doughnut, HorizontalBar, Bar } from 'react-chartjs-2';
import Color from '../helpers/colors';
import '../styles/stats.css';
import MyDate from '../helpers/date';
import {firebaseApp} from '../helpers/firebase';
import Loader from '../helpers/preloader';
import M from 'materialize-css';
import CloudFunctionURL from '../helpers/constants';
import Footer from '../components/footer';

export default class Statistics extends Component{
    constructor(props){
        super(props);
        this.state ={
            data:[],
            expenseCategory:{chartLegends:{labels:[]}},
            incomeCategory:{chartLegends:{labels:[]}},
            incomeExpense:{},
            dailyOverview:{data:{}, legends:[]},
            totalExpense:0,
            totalIncome:0,
            isLoading:false,
            accounts:[],
            currentAccount:'Cash',
            user:{}
        }
    }
    componentWillMount(){
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
                });
            }else {
                context.props.history.push('/auth');
            }
        });
    }
    getData(){
        this.setState({isLoading:true});
        let params={'account':this.state.currentAccount};
        axios.get(CloudFunctionURL+'api/exchanges', {params})
        .then(res=>{
            let sortedData=res.data;
            sortedData.sort((a, b) => {
                return b.amount - a.amount;
            });
            this.setState({data:sortedData});
            this.calculateChartData();
        });
    }
    componentDidMount(){
        this.initializeComponents()
    }
    initializeComponents(){
        M.Dropdown.init(document.querySelectorAll('.account-dropdown'), {
            constrainWidth:false,
            alignment:'left'
        });
    }
    calculateChartData(){
        if(this.state.data.length>0){
            this.calculateExpenseCategories();
            this.calculateIncomeCategories();
            this.calculateIncomeExpense();
            this.calculatedailyOverview();
        }
        this.setState({isLoading:false});
    }
    calculateExpenseCategories(){
        let chartLabels={};
        let bgColors={};
        let totalExpense=0;
        for(let index in this.state.data){
            if(this.state.data[index].type==='Expense'){
                let amount=this.state.data[index].amount;
                let lblName=this.state.data[index].category;
                chartLabels[`${lblName}`]=chartLabels[`${lblName}`]?chartLabels[`${lblName}`]:0;
                chartLabels[`${lblName}`]+=Number(amount);
                totalExpense+=Number(amount);
            }
        }
        let finalData={};
        for(let index in Object.keys(chartLabels)){
            let amount=chartLabels[Object.keys(chartLabels)[index]];
            finalData[Object.keys(chartLabels)[index]+' ('+(this.state.user.photoURL? JSON.parse(this.state.user.photoURL).symbol : '') +amount+')']=amount
        }
        while(Object.keys(bgColors).length<Object.keys(chartLabels).length){
            bgColors[Color.getRandomColor()]='1'
        }
        let expenseCategoryChartData={
            labels:Object.keys(finalData),
            datasets:[{
                data:Object.values(finalData),
                backgroundColor: Object.keys(bgColors)
            }],
            chartLegends:{
                labels:Object.keys(finalData),
                backgrounds: Object.keys(bgColors)
            }
        };
        let context=this;
        this.setState({
            ExpenselabelConfig:{
                legend:{
                    display:false,
                    labels:{
                        boxWidth:13,
                        fontSize:13
                    },
                    position:'left',
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let dataIndex=tooltipItem.index;
                            return context.state.expenseCategory.labels[dataIndex] + ' '+
                            Math.round(context.state.expenseCategory.datasets[0].data[dataIndex]/context.state.totalExpense *100) +'%'
                        }
                    }
                }

            },
            totalExpense,
        });
        this.setState({expenseCategory:expenseCategoryChartData});
    }
    calculateIncomeCategories(){
        let chartLabels={};
        let bgColors={};
        let totalIncome=0;
        for(let index in this.state.data){
            if(this.state.data[index].type==='Income'){
                let amount=this.state.data[index].amount;
                let lblName=this.state.data[index].category;
                chartLabels[`${lblName}`]=chartLabels[`${lblName}`]?chartLabels[`${lblName}`]:0;
                chartLabels[`${lblName}`]+=Number(amount);
                totalIncome+=Number(amount);
            }
        }
        let finalData={};
        for(let index in Object.keys(chartLabels)){
            let amount=chartLabels[Object.keys(chartLabels)[index]];
            finalData[Object.keys(chartLabels)[index]+' ('+(this.state.user.photoURL? JSON.parse(this.state.user.photoURL).symbol : '')+amount+')']=amount
        }
        while(Object.keys(bgColors).length<Object.keys(chartLabels).length){
            bgColors[Color.getRandomColor()]='1'
        }
        let incomeCategoryChartData={
            labels:Object.keys(finalData),
            datasets:[{
                data:Object.values(finalData),
                backgroundColor: Object.keys(bgColors)
            }],
            chartLegends:{
                labels:Object.keys(finalData),
                backgrounds: Object.keys(bgColors)
            }
        };
        let context=this;
        this.setState({IncomelabelConfig:{
            legend:{
                display:false,
                labels:{
                    boxWidth:13,
                    fontSize:13
                },
                position:'left',
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        let dataIndex=tooltipItem.index;
                        return context.state.incomeCategory.labels[dataIndex] + ' '+
                        Math.round(context.state.incomeCategory.datasets[0].data[dataIndex]/context.state.totalIncome *100) +'%'
                    }
                }
            }
        }});
        this.setState({incomeCategory:incomeCategoryChartData, totalIncome});
    }
    calculateIncomeExpense(){
        let incomeExpense={
            labels:['Total Income', 'Total Expense'],
            datasets:[{
                data:[this.state.totalIncome, this.state.totalExpense],
                backgroundColor: ['#42A5F5', '#EF5350']
            }]
        };
        this.setState({IncomeExpenselabelConfig:{
            scales: {
                yAxes: [{
                    type:'category',
                    barPercentage: 0.5,
                    barThickness: 40,
                    maxBarThickness: 40,
                    minBarLength: 40,
                    gridLines: {
                       display: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: 0,
                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
            legend:{
                display:false
            }
        }});
        this.setState({incomeExpense})
    }
    calculatedailyOverview(){
        let chartData={};
        let sfExp=0;
        let sfInc=0;
        let data=this.state.data;
        data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        let allDates=MyDate.getDateRange(new Date(data[0].date), new Date(data[data.length-1].date));
        for(let index in allDates){
            let date=allDates[index];
            for(let j in data){
                let item=data[j];
                if(!chartData[date]){
                    chartData[date]={income:0, expense:0, sfExp, sfInc};
                }
                if(MyDate.parseDate(item.date)===date){
                    if(item.type==="Expense"){
                        sfExp+=Number(item.amount);
                        chartData[date].expense+=Number(item.amount);
                        chartData[date].sfExp = sfExp;
                    }else if(item.type==="Income"){
                        sfInc+=Number(item.amount);
                        chartData[date].income+=Number(item.amount);
                        chartData[date].sfInc = sfInc;
                    }
                } 
            }
        }
        let expColor='#EF5350';
        let incColor='#42A5F5';
        let dailyOverviewChartData={
            labels:allDates.map(item=>{return item.substring(0, item.length-6)}),
            datasets:[{
                label:'Expense',
                data: Object.keys(chartData).map(date=>{ return chartData[date].expense}),
                backgroundColor: expColor
            },{
                label:'Income',
                data:Object.keys(chartData).map(date=>{ return chartData[date].income}),
                backgroundColor: incColor
            },{
                label:'Balance',
                type:'line',
                data:Object.keys(chartData).map(date=>{ return (chartData[date].sfInc-chartData[date].sfExp)}),
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor:'#4A148C',
                pointBackgroundColor:'#4A148C',
                lineTension:0
            }]
        };
        let dailyOverview={
            data:dailyOverviewChartData,
            legends:[
                {
                    title:'Expense',
                    color:expColor
                },
                {
                    title:'Income',
                    color:incColor
                },
                {
                    title:'Account Balance',
                    color:'#4A148C'
                }
            ],
            labelConfig:{
                scales: {
                    yAxes: [{
                        gridLines: {
                           display: false
                        },
                        ticks: {
                            min:0
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fontSize:8
                        }
                    }]
                },
                legend:{
                    display:false
                }
            }
        }
        this.setState({dailyOverview})
    }
    changeAccount(account){
        this.setState({currentAccount:account});
    }
    componentDidUpdate(prevProps, prevState){
        if(this.state.currentAccount!==prevState.currentAccount){
            this.getData();
        }
        window.onresize = function(event) {
            adjustHeight()
        };
        adjustHeight();
        function adjustHeight(){
            try{
                let g1 = document.getElementById('expense-card').clientHeight;
                let g2 = document.getElementById('income-expense').clientHeight;
                let diff=g1-g2-25;
                document.getElementById('stat-summary').style.height= diff+"px";
            }catch(error){
                console.log("Couldn't resize card", error);
            }
        }
    }
    render(){return(
        <div>
        <Navbar />
        <div className="container container-for-stats">
            <div className="row">
                <div className="col s12 l12">
                <div className="account-selection-stats">
                    <span className='dropdown-trigger account-dropdown' data-target='dropdown1'><b>{this.state.currentAccount}</b> <i className="material-icons">expand_more</i></span>
                    <ul id='dropdown1' className='dropdown-content'>
                        <li className="disabled"><span>Choose an account</span></li>
                        {this.state.accounts.map((item, key)=>{
                            return <li key={key}><span onClick={()=>this.changeAccount(item)}>{item}</span></li>
                        })}
                    </ul>
                </div>
                </div>
            </div>
            <div className="row">
                <div className="col s12 l8">
                    <div className="card" id="expense-card">
                        <div className="card-content" style={{'overflow':'overlay'}}>
                            <span className="card-title">
                                Daily overview
                                {this.state.isLoading? <Loader specialClass="stat-loader" /> : ''}
                            </span>
                            <Bar data={this.state.dailyOverview.data} options={this.state.dailyOverview.labelConfig} />
                            <div className="legend-container" style={{'textAlign':'center', 'width':'100%'}}>
                                {this.state.dailyOverview.legends.map((item, key)=>{
                                    return <div key={key} style={{'display':'inline-block', 'marginLeft':'10px'}}>
                                                <div className="legend-color" style={{'backgroundColor':this.state.dailyOverview.legends[key].color}}> </div>
                                                <span className="legend-name">{item.title}</span>
                                            </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 l4">
                    <div className="white-text card teal" id="stat-summary">
                       <div className="card-content half-container">
                            <div className="half">
                                <span className="half-title">Income</span><br />
                                {(this.state.user.photoURL? JSON.parse(this.state.user.photoURL).symbol : '')} <span className="half-amount">{this.state.totalIncome}</span>
                            </div>
                            <div className="half">
                                <span className="half-title">Expense</span><br />
                                {(this.state.user.photoURL? JSON.parse(this.state.user.photoURL).symbol : '')} <span className="half-amount">{this.state.totalExpense}</span>
                            </div>
                       </div>
                    </div>
                </div>
                <div className="col s12 l4">
                    <div className="card" id="income-expense">
                        <div className="card-content">
                            <span className="card-title">Income vs Expense</span>
                            <HorizontalBar data={this.state.incomeExpense} options={this.state.IncomeExpenselabelConfig} />
                        </div>
                        <div className="card-action">
                           <span className="bottom-line">
                               Amount left:&nbsp;
                               <b>{(this.state.user.photoURL? JSON.parse(this.state.user.photoURL).symbol : '')}{(this.state.totalIncome-this.state.totalExpense)}</b>
                                <span className="remaining-percent">({(Math.round((this.state.totalIncome-this.state.totalExpense)/this.state.totalIncome *100))}% of Income)</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col s12 l6">
                    <div className="card">
                        <div className="card-content" style={{'overflowY' : 'overlay', 'overflowX' : 'hidden'}}>
                            <span className="card-title">Expenses by category</span>
                            <div className="chart-container">
                                <Doughnut height={500} width={500} data={this.state.expenseCategory} options={this.state.ExpenselabelConfig} />
                            </div>
                            <div className="legend-container">
                                {this.state.expenseCategory.chartLegends.labels.map((item, key)=>{
                                    return <div key={key}>
                                                <div className="legend-color" style={{'backgroundColor':this.state.expenseCategory.chartLegends.backgrounds[key]}}> </div>
                                                <span className="legend-name">{item}</span>
                                            </div>
                                })}
                            </div>
                        </div>
                        <div className="card-action">
                           <span className="bottom-line">Total Expense: <b>{(this.state.user.photoURL? JSON.parse(this.state.user.photoURL).symbol : '')}{this.state.totalExpense}</b></span>
                        </div>
                    </div>
                </div>
                <div className="col s12 l6">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Incomes by category</span>
                            <div style={{'overflowY' : 'overlay', 'overflowX' : 'hidden'}}>
                                <div className="chart-container">
                                    <Doughnut height={500} width={500} data={this.state.incomeCategory} options={this.state.IncomelabelConfig} />
                                </div>
                                <div className="legend-container">
                                    {this.state.incomeCategory.chartLegends.labels.map((item, key)=>{
                                        return <div key={key}>
                                                    <div className="legend-color" style={{'backgroundColor':this.state.incomeCategory.chartLegends.backgrounds[key]}}> </div>
                                                    <span className="legend-name">{item}</span>
                                                </div>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="card-action">
                           <span className="bottom-line">Total Income: <b>{(this.state.user.photoURL? JSON.parse(this.state.user.photoURL).symbol : '')}{this.state.totalIncome}</b></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    )}
}