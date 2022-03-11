import React, { Component } from "react";
import { GOOGLE_API_KEY } from '../config';
import './AddEdit.css';
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


class AddEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            phone: "",
            commune: "",
            quartier: "",
            rue: "",
            villa: "",
            immeubleEtage: "",
            immeubleNumPorte: "",
            town: "",
            idcard: "",
            operator: "",
            latitude: "",
            longitude: "",
            userAddress: "",
            formErrors: {
                firstName: "",
                lastName: "",
                phone: "",
                idcard: "",
                town: ""
            },
            opFirstName: "",
            opLastName: "",
            opPhone: "",
            operatorLists: ""
        };

        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.reverseGeocodeCoordinates = this.reverseGeocodeCoordinates.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getOperatorList2 = this.getOperatorList2.bind(this);
        //this.history = this.useHistory(this);

        //this.getLocation();

        // this.getOperatorList();
        // this.getOperatorList2();

    }

    getOperatorList() {
        fireDb.child("geopostoperators").get().then((snapshot) => {
            snapshot.forEach(item => {
                this.setState([...this.state, this.state.operatorLists = item.data()])
            })
        });
    }

    getOperatorList2() {
        fireDb.child("geopostoperators").get().then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var key = childSnapshot.key;
                var operatorLists = childSnapshot.val();
                console.log(operatorLists)

            })
        });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        }
        else {
            alert("Geolocalisation is not supported by this browser.");
        }
    }

    handleLocationError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.")
                break;
            default:
                break;
        }

    }
    watchPosition() {
        navigator.geolocation.watchPosition((position) => {
            console.log(
                `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);
        }, (err) => {
            console.error(err);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        })
    }

    getCoordinates(position) {
        console.log(position)
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })

        //setTimeout(() => { this.reverseGeocodeCoordinates(); }, 2000);
        this.reverseGeocodeCoordinates()

    }

    reverseGeocodeCoordinates() {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latitude},${this.state.longitude}&sensor=false&key=${GOOGLE_API_KEY}`)
            .then(response => response.json())
            .then(data => this.setState({
                userAddress: data.results[0].formatted_address
            }))
            .catch(error => alert(error))
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

        if (!this.state.firstName || !this.state.lastName || !this.state.phone || !this.state.town) {
            toast.error("Merci de rensigner les informations obligatoires")
        } else {
            fireDb.child("geopostusers").push(this.state, (err) => {
                if (err) {
                    toast.error(err);
                } else {
                    toast.success("Utilisateur Enregistré avec succès")
                }
            });
            //setTimeout(() => this.history.push("/"), 500);
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
            case "town":
                formErrors.town =
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
        //this.getLocation();

        return (
            <div className="wrapper">
                <div className="form-wrapper">
                    <h1>Enregistrement</h1>
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
                        <div className="town">
                            <label htmlFor="town">Ville*</label>
                            <input type="text" className={formErrors.town.length > 0 ? "error" : null} id="town" placeholder='Ville' name='town' value={this.state.town} noValidate onChange={this.handleInputChange} />
                            {formErrors.town.length > 0 && (
                                <span className="errorMessage">{formErrors.town}</span>
                            )}
                        </div>
                        <div className="commune">
                            <label htmlFor="commune">Commune</label>
                            <input type="text" className='' id="commune" placeholder='commune' name='commune' value={this.state.commune} noValidate onChange={this.handleInputChange} />
                        </div>
                        <div className="quartier">
                            <label htmlFor="quartier">Quartier</label>
                            <input type="text" className='' id="quartier" placeholder='quartier' name='quartier' value={this.state.quartier} noValidate onChange={this.handleInputChange} />
                        </div>

                        <div className="rue">
                            <label htmlFor="rue">Numéro de rue</label>
                            <input type="number" className='' id="rue" placeholder='Numéro de rue' name='rue' value={this.state.rue} noValidate onChange={this.handleInputChange} />
                        </div>
                        <div className="villa">
                            <label htmlFor="villa">Numéro villa</label>
                            <input type="number" className='' id="villa" placeholder='numéro villa' name='villa' value={this.state.villa} noValidate onChange={this.handleInputChange} />
                        </div>
                        <div className="immeubleEtage">
                            <label htmlFor="immeubleEtage">Etage</label>
                            <input type="number" className='' id="immeubleEtage" placeholder='étage' name='immeubleEtage' value={this.state.immeubleEtage} noValidate onChange={this.handleInputChange} />
                        </div>
                        <div className="immeubleNumPorte">
                            <label htmlFor="immeubleNumPorte">Numéro de porte</label>
                            <input type="number" className='' id="immeubleNumPorte" placeholder='numéro de porte' name='immeubleNumPorte' value={this.state.immeubleNumPorte} noValidate onChange={this.handleInputChange} />
                        </div>
                        <div className="idcard">
                            <label htmlFor="idcard">Carte identité</label>
                            <input type="text" className='' placeholder='carte identité' name='idcard' value={this.state.idcard} noValidate onChange={this.handleInputChange} />
                        </div>
                        {/* <div className="operator">
                <label htmlFor="operator">Nom opérateur</label>
                <input type="text" className='' placeholder='nom operateur' name='operator' noValidate onChange={this.handleChange} />
              </div> */}

                        {/* <div className="select-container">
                            <select value={this.childData} onChange={this.handleInputChange}>
                                {this.childData.map((option) => (
                                    <option value={option.firstName}>{option.firstName}</option>
                                ))}
                            </select>
                        </div> */}
                        <div className="location">
                            <p>Latitude: {this.state.latitude} </p>
                            <p>Longitude: {this.state.longitude} </p>
                            <h4>Adresse Google Maps</h4>
                            <p>Addresse: {this.state.userAddress}</p>
                            <div className="createAccount">
                                <button type="button" onClick={this.getLocation}>Afficher les coordonées</button>
                            </div>
                            {
                                this.state.latitude && this.state.longitude ?
                                    <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.latitude},${this.state.longitude}&zoom=14&size=400x300&sensor=false&&markers=color:red%7C${this.state.latitude},${this.state.longitude}&key=${GOOGLE_API_KEY}`} alt='' />
                                    :
                                    null
                            }
                        </div>
                        <div className="location">
                            <input type="submit" value="Enregistrer" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddEdit;
