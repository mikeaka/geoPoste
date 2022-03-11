import React, { Component } from "react";
import './AddOperator.css';
import fireDb from "../firebase";
import { toast } from "react-toastify";


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

class AddOperator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            phone: "",
            formErrors: {
                firstName: "",
                lastName: "",
                phone: ""
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state)

        if (formValid(this.state)) {
            console.log(`
              --SUBMITTING--
              First Name: ${this.state.firstName}
              Last Name: ${this.state.lastName}
              Phone: ${this.state.phone}
              IdCard: ${this.state.idcard}
            `);
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }

        if (!this.state.firstName || !this.state.lastName || !this.state.phone) {
            toast.error("Merci de rensigner les informations obligatoires")
        } else {
            fireDb.child("geopostoperators").push(this.state, (err) => {
                if (err) {
                    toast.error(err);
                } else {
                    toast.success("Opérateur Enregistré avec succès")
                    this.setState({})
                }
            });

            setTimeout(() => {

                document.location.href = "/operatorList"
            }, 2000)
        }

    };

    handleInputChange = e => {
        e.preventDefault();
        // const { name, value } = e.target;
        // this.setState({ ...this.state, [name]: value });
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };

        switch (name) {
            case "firstName":
                formErrors.firstName =
                    value.length < 3 ? "3 caractères minimum" : "";
                break
            case "lastName":
                formErrors.lastName =
                    value.length < 3 ? "3 caractères minimum" : "";
                break;
            case "phone":
                formErrors.phone = phoneRegex.test(value)
                    ? ""
                    : "Numéro de téléphone invalide";
                break;
            case "idcard":
                formErrors.idcard =
                    value.length < 6 ? "6 caractères minimum" : "";
                break;
            default:
                break;
        }

        this.setState({
            formErrors, [e.target.name]: e.target.value
        });
    };

    render() {
        const { formErrors } = this.state;
        // const { items } = this.state;
        //this.getLocation();

        return (
            <div className="wrapper-operator">
                <div className="form-wrapper-operator">
                    <h1>Enregistrement Opérateur</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="firstName">
                            <label htmlFor="firstName">Prénom*</label>
                            <input type="text" className={formErrors.firstName.length > 0 ? "error" : null} id="firstName" placeholder='Prénom' name='firstName' value={this.state.firstName} noValidate onChange={this.handleInputChange} />
                            {formErrors.firstName.length > 0 && (
                                <span className="errorMessage">{formErrors.firstName}</span>
                            )}
                        </div>
                        <div className="lastName">
                            <label htmlFor="lastName">Nom*</label>
                            <input type="text" className={formErrors.lastName.length > 0 ? "error" : null} id="lastName" placeholder='Nom de famille' name='lastName' value={this.state.lastName} noValidate onChange={this.handleInputChange} />
                            {formErrors.lastName.length > 0 && (
                                <span className="errorMessage">{formErrors.lastName}</span>
                            )}
                        </div>
                        <div className="phone">
                            <label htmlFor="phone">téléphone*</label>
                            <input type="number" className={formErrors.phone.length > 0 ? "error" : null} id="phone" placeholder='téléphone' name='phone' value={this.state.phone} noValidate onChange={this.handleInputChange} />
                            {formErrors.phone.length > 0 && (
                                <span className="errorMessage">{formErrors.phone}</span>
                            )}
                        </div>
                        <div className="enregistrer">
                            <input type="submit" value="Enregistrer" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddOperator;
