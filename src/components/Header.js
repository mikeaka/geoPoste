import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "../img/logo1.png"
import "./Header.css"

const Header = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const location = useLocation();

    useEffect(() => {
        if (location.pathname == "/") {
            setActiveTab("Home")
        } else if (location.pathname == "/add") {
            setActiveTab("AddUser")
        } else if (location.pathname == "/AddOperator") {
            setActiveTab("AddOperator")
        } else if (location.pathname == "/operatorList") {
            setActiveTab("operatorList")
        }
    }, [location]);

    return (
        <div className='header'>
            <p>
                <img src={Logo} className="logo" width="100" alt="" /><br />
                <p>Give Your Name we find you</p>
            </p>
            <div className="header-right">
                <Link to='/'>
                    <p
                        className={`${activeTab == "Home" ? "active" : ""}`}
                        onClick={() => setActiveTab("Home")}
                    >
                        Accueil
                    </p>
                </Link>
                <Link to='/add'>
                    <p
                        className={`${activeTab == "AddUser" ? "active" : ""}`}
                        onClick={() => setActiveTab("AddUser")}
                    >
                        Enregistrement Utilisateur
                    </p>
                </Link>
                <Link to='/addOperator'>
                    <p
                        className={`${activeTab == "AddOperator" ? "active" : ""}`}
                        onClick={() => setActiveTab("AddOperator")}
                    >
                        Ajout Opérateur
                    </p>
                </Link>
                <Link to='/operatorList'>
                    <p
                        className={`${activeTab == "operatorList" ? "active" : ""}`}
                        onClick={() => setActiveTab("operatorList")}
                    >
                        Liste des opérateurs
                    </p>
                </Link>
            </div>
        </div>
    )
}

export default Header