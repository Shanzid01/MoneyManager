import React, {Component} from 'react';
import '../styles/footer.css';
export default class Footer extends Component{
    render(){return(
        <div className="footer-body">
            <a href="./privacy">Privacy policies</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;<a href="./terms">Terms and conditions</a>
        </div>
    )}
}