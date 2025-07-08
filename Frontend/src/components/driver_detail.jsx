import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { refreshAccessToken } from '../authenticate/auth';
import '../css/vehicles.css'
import { useNavigate, useParams } from 'react-router';
import '../css/vehicles.css'

export default function DriverDetail() {
    const { driverID } = useParams()
    const navigate = useNavigate()
    const [driver, setDriver] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    useEffect(() => {
        const fetchDriver = async () => {
            const access = localStorage.getItem('access')
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/drivers/${driverID}/`, {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                });
                setDriver(response.data);
                setLoading(false);
            } catch (error) {
                setError(true)
                if (error.response?.status == 401) {
                    const newAccess = await refreshAccessToken();
                    if (newAccess) {
                        try {
                            const retry = await axios.get(`http://127.0.0.1.1:8000/api/drivers/${driverID}/`, {
                                headers: {
                                    'Authorization': `Bearer ${newAccess}`
                                }
                            })
                            setDriver(retry.data);
                            setLoading(false)
                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        console.log('Access token is invalid')
                        navigate('/')
                    }
                } else {
                    console.error("API error:", error);
                }
            } finally {
                setLoading(false)
            }
        }
        fetchDriver()

    }, [driverID])

    const deletehandle = async (e) => {
        e.preventDefault()
        const access = localStorage.getItem('access')
        try {
            const response = await axios.delete(`http://127.0.0.1.1:8000/api/user_delete/${driverID}`, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            });
            navigate('/drivers')
        } catch (error) {
            console.error("API error:", error);
            if (error.response?.status == 401) {
                const newAccess = await refreshAccessToken();
                if (newAccess) {
                    const retry = await axios.delete(`http://127.0.0.1.1:8000/api/user_delete/${driverID}`, {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`
                        }
                    });
                    navigate('/drivers')

                } else {
                    console.log('Access token is invalid')
                    localStorage.removeItem('access')
                    navigate('/')
                }
            }
        }
    }
    console.log(driverID);
    
    return (
        <>
            <div style={styles}>

                <h2 style={{ textAlign: "center" }}>Drivers</h2>
                <hr />

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>
                    {
                        loading ? <h4>fetching data...</h4> :
                            error ? <h4>Driver Detail Not exist</h4> :
                                <div >
                                    <div style={detail}>
                                        <span><img src={`http://localhost:8000/${driver.user?.profile_image}`} /></span>
                                        <span>Name : {driver.user?.first_name} {driver.user?.last_name}</span>
                                        <span>Email : {driver.user?.email}</span>
                                        <span>Date of Birth : {driver.user?.date_of_birth}</span>
                                    </div>

                                    <div style={detail}>
                                        <span style={{ width: "222px",color:"blue" }} >{driver.license.split("/")[3]}</span>

                                        <span>License Expiry : {driver.license_exp}</span>
                                        <span>Driving Experience : {driver.experience} years</span>

                                    </div>

                                    <div style={detail}>
                                        <span>Vehical Assigned :  {
                                            driver.vehicle_assigned?.vehicle_name ?
                                                driver.vehicle_assigned?.vehicle_name :
                                                "No Vehicle Assigned"
                                        } </span>
                                        <span>Address : {driver.address}</span>
                                    </div>

                                </div>

                    }

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px' }}>
                    <Button variant="primary">Update</Button>
                    <Button variant="danger" onClick={deletehandle}>Delete</Button>
                </div>
            </div>
        </>
    )
}

const detail = {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "20px",
    // border:".5px solid black",
    boxShadow: "inset rgba(0, 0, 0, 0.2) -5px -3px 18px 0rem",

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