import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../css/vehicles.css'
import { refreshAccessToken } from '../authenticate/auth'
import { Link, useNavigate } from 'react-router';
import api, { MyBaseUrl } from '../Api';


export default function Vehicles() {
    const [searchValue, setSearchValue] = useState('')
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const [vehicles, setVehicles] = useState({})
    const [loading, setLoading] = useState(true)

    async function fetchVehicles(value = '') {
        try {
            const access_token = localStorage.getItem('access')
            const response = await api.get(`api/vehicles/?search=${value}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            })
            setVehicles(response.data.data)
            setUsers(response.data.users)

            setLoading(false)
        }
        catch (error) {
            console.log(error)
            if (error.response?.status == 401) {
                const newAccess = await refreshAccessToken()
                if (newAccess) {
                    try {
                        const retry = await api.get(`api/vehicles/?search=${value}`, {
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
    useEffect(() => {
        fetchVehicles()
    }, [])

    function handleSearch() {
        setLoading(true)
        fetchVehicles(searchValue)
        setLoading(false)
    }

    async function deletehandle(vehicleID, vehicleName) {
        const access = localStorage.getItem('access')
        try {
            const res = await api.delete(`api/delete_vehicle/${vehicleID}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
            navigate('/home/vehicles')
            alert(`${vehicleName} Deleted Successfully`)
        } catch (error) {
            if (error.res?.status == 401) {
                const newAccess = await refreshAccessToken()
                if (newAccess) {
                    const retry = await api.delete(`api/delete_vehicle/${vehicleID}`, {
                        headers: {
                            Authorization: `Bearer ${newAccess}`
                        }
                    })
                    alert(` ${vehicleName} Deleted Successfully`)
                    navigate('/hame/vehicles')
                } else {
                    console.log('Retry token Unsuccessful');
                    localStorage.removeItem('access')
                    navigate('/')
                }
            } else {
                console.log(error);
            }
        }
    }

    console.log(users);
    

    return (
        <>
            <div style={styles}>


                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ margin: "12px", }}>
                        <Link to="/home/addVehicle"><Button>Add Vehicle</Button></Link>
                    </div>
                    <h2>Vehicles</h2>
                    <div style={{ margin: "12px", }}>
                        <input type="text" name="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        <Button style={{ marginLeft: "12px" }} onClick={handleSearch}>Search</Button>
                    </div>
                </div>


                <hr />
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>
                    {loading ? (<p>Loading Vehicles ... </p>) :
                        vehicles.map((vehicle, index) => {
                            const addedBy = users.find((user) => user.id === vehicle.created_by);
                            return (
                                <Card key={index} >
                                    <Card.Img variant="top" style={{ width: "100%", height: "80%" }} src={`${MyBaseUrl}${vehicle.vehicle_photos}`} />
                                    <Card.Body>
                                        <Card.Title style={{ textAlign: "center", textTransform: "capitalize" }}>{vehicle.vehicle_name}</Card.Title>

                                        <Card.Text>

                                            <span>Type: {vehicle.vehicle_type}</span>
                                            <span>Model: {vehicle.vehicle_model}</span>
                                            <span>Chassi Number : {vehicle.vehicle_chassiNumber}</span>
                                            <span>Registration Number : {vehicle.vehicle_registration}</span>
                                            <span>Year : {vehicle.vehicle_year}</span>
                                            <span>Added By : {addedBy?.username || "unknown"}</span>


                                        </Card.Text>
                                        <Button variant='danger' onClick={() => { deletehandle(vehicle.id, vehicle.vehicle_name) }}>Delete</Button>
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