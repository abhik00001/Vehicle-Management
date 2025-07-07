import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../css/vehicles.css'
import {refreshAccessToken} from '../authenticate/auth'
import { useNavigate } from 'react-router';


export default function Vehicles() {
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchVehicles() {
            try {
                const access_token = localStorage.getItem('access')
                const response = await axios.get("http://127.0.0.1:8000/api/vehicles/", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    }
                })
                setVehicles(response.data)
                setLoading(false)
            }
            catch (error) {
                console.log(error)
                if (error.response?.status == 401) {
                    const newAccess = await refreshAccessToken()
                    if (newAccess) {
                        try {
                            const retry = await axios.get("http://127.0.0.1:8000/api/vehicles/", {
                                headers: {
                                    Authorization: `Bearer ${newAccess}`,
                                }
                            });
                            setVehicles(retry.data)
                            setLoading(false)
                        }
                        catch (retry_error) {
                            console.log(retry_error)
                        }
                    } else {
                        console.log("could not retry token");
                        localStorage.removeItem('access')
                        navigate("/")
                    }
                } else {
                    console.error("API error:", error);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchVehicles()
    }, [])
    return (
        <>
            <div style={styles}>

                <h2 style={{ textAlign: "center" }}>Vehicles</h2>
                <hr />
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>
                    {loading ? (<p>Loading Vehicles ... </p>) :
                        vehicles.map((vehicle, index) => {
                            return (
                                <Card key={index} >
                                    <Card.Img variant="top" src={`http://127.0.0.1:8000${vehicle.vehicle_photos}`} />
                                    <Card.Body>
                                        <Card.Title style={{ textAlign: "center" }}>{vehicle.vehicle_name}</Card.Title>

                                        <Card.Text>

                                            <span>Type: {vehicle.vehicle_type}</span>
                                            <span>Model: {vehicle.vehicle_model}</span>
                                            <span>Chassi Number : {vehicle.vehicle_chassiNumber}</span>
                                            <span>Registration Number : {vehicle.vehicle_registration}</span>
                                            <span>Year : {vehicle.vehicle_year}</span>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        }
                        )
                    }
                </div>
            </div>
        </>
    )
}

const styles = {
    width: "80%",
    // border:"2px solid green",

    margin: "20px auto",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
}