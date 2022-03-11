import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import fireDb from '../firebase';
import "./Home.css";

const Home = () => {

    const [data, setData] = useState({});

    const onDelete = (id) => {
        if (window.confirm("Etes vous sure de vouloir supprimer cette entrée ?")) {
            fireDb.child(`geopostusers/${id}`).remove((err) => {
                if (err) {
                    toast.error(err);
                }
                else {
                    toast.success("supprimé de la base");
                }
            })
        }
    }

    useEffect(() => {
        fireDb.child("geopostusers").on("value", (snapshot) => {
            if (snapshot.val() !== null) {
                setData({ ...snapshot.val() });
            }
            else {
                setData({});
            }
        });
        return () => {
            setData({});
        };
    }, []);

    return (
        <div style={{ marginTop: "100px" }}>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}> No</th>
                        <th style={{ textAlign: "center" }}> Prénom</th>
                        <th style={{ textAlign: "center" }}> Nom</th>
                        <th style={{ textAlign: "center" }}> Téléphone</th>
                        <th style={{ textAlign: "center" }}> Commune</th>
                        <th style={{ textAlign: "center" }}> Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* maping the objects we have in database */}
                    {
                        Object.keys(data).map((id, index) => {
                            return (
                                <tr key={id}>
                                    <th scope="row">
                                        {index + 1}
                                    </th>
                                    <td>{data[id].firstName}</td>
                                    <td>{data[id].lastName}</td>
                                    <td>{data[id].phone}</td>
                                    <td>{data[id].commune}</td>
                                    <td>
                                        <Link to={`/update/${id}`}>
                                            <button className="btn btn-edit">Edit</button>
                                        </Link>
                                        <button className="btn btn-delete" onClick={() => onDelete(id)}>Delete</button>

                                        <Link to={`/view/${id}`}>
                                            <button className="btn btn-view">View</button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        }
                        )
                    }
                </tbody>
            </table>

        </div>
    )
}
export default Home;