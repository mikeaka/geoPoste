import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './test.css';
import fireDb from "../firebase";
import { toast } from "react-toastify";

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const phoneRegex = RegExp(/^((\+)225|0)[1-9](\d{2}){4}$/);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

const initialState = {
    firstName: "",
    lastName: "",
    phone: "",
    formErrors: {
        firstName: "",
        lastName: "",
        phone: ""
    }
};

const Test = () => {
    const [state, setState] = useState(initialState);

    // avoid typing state.firsname, state.lastName, ...
    const {
        firstName,
        lastName,
        phone
    } = state;

    //const history = useHistory();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !phone) {
            toast.error("Merci de rensigner les informations obligatoires")
        } else {
            fireDb.child("geopostoperators").push(state, (err) => {
                if (err) {
                    toast.error(err);
                } else {
                    toast.success("Opérateur Enregistré avec succès")
                }
            });
            setTimeout(() => navigate('/operatorList', { replace: true }), 500);
        }


    };

    const handleInputChange = (e) => {
        // const { name, value } = e.target;
        // this.setState({ ...this.state, [name]: value });
        const { name, value } = e.target;

        setState({ ...state, [name]: value });

    };


    return (
        <div className="wrapper">
            <div className="form-wrapper">
                <h1>Enregistrement</h1>
                <form onSubmit={handleSubmit}>
                    <div className="firstName">
                        <label htmlFor="firstName">Prénom*</label>
                        <input type="text" className="" id="firstName" placeholder='Prénom' name='firstName' value={firstName} onChange={handleInputChange} />

                    </div>
                    <div className="lastName">
                        <label htmlFor="lastName">Nom*</label>
                        <input type="text" className="" id="lastName" placeholder='Nom de famille' name='lastName' value={lastName} onChange={handleInputChange} />
                    </div>
                    <div className="phone">
                        <label htmlFor="phone">téléphone*</label>
                        <input type="number" className="" id="phone" placeholder='téléphone' name='phone' value={phone} onChange={handleInputChange} />
                    </div>
                    <div className="location">
                        <input type="submit" value="Enregistrer" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Test