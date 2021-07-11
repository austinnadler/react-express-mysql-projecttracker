import React from 'react';
import Logo from '../../assets/img/logo192.png';

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7"
}

const Footer = () => {
    return(
        <div className="fixed-bottom text-center" style={style}>
            <small>Made with React&nbsp;</small>
            <img src={Logo} alt="React logo" height="40" width="40"/>
        </div>        
    );
}
export default Footer;
