import React, {Component} from 'react';
import '../styles/global.css';

export default class Loader extends Component{
    render(){return(
        <div className={"loader-container "+this.props.specialClass}>
            <div className="preloader-wrapper small active">
                <div className="spinner-layer spinner-yellow-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
                </div>
            </div>
        </div>
    )};
}