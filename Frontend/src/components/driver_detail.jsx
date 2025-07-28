import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { refreshAccessToken } from '../authenticate/auth';
import '../css/vehicles.css'
import { useNavigate, useParams } from 'react-router';
import '../css/vehicles.css'
import api, { MyBaseUrl } from '../Api';

export default function DriverDetail() {
    const { driverID } = useParams()
    const [users,setUsers] = useState([])
    const navigate = useNavigate()
    const [driver, setDriver] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    useEffect(() => {
        const fetchDriver = async () => {
            const access = localStorage.getItem('access')
            try {
                const response = await api.get(`api/drivers/${driverID}/`, {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                });
                setDriver(response.data.data);
                setUsers(response.data.users)
                setLoading(false);
            } catch (error) {
                setError(true)
                if (error.response?.status == 401) {
                    const newAccess = await refreshAccessToken();
                    if (newAccess) {
                        try {
                            const retry = await api.get(`api/drivers/${driverID}/`, {
                                headers: {
                                    'Authorization': `Bearer ${newAccess}`
                                }
                            })
                            setDriver(retry.data.data);
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
        const access = localStorage.getItem('access')
        try {
            const response = await api.delete(`api/delete_driverUser/${driverID}`, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            });
            navigate('/home/drivers')
        } catch (error) {
            console.error("API error:", error);
            if (error.response?.status == 401) {
                const newAccess = await refreshAccessToken();
                if (newAccess) {
                    const retry = await api.delete(`api/delete_driverUser/${driverID}`, {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`
                        }
                    });
                    navigate('/home/drivers')

                } else {
                    console.log('Access token is invalid')
                    localStorage.removeItem('access')
                    navigate('/')
                }
            }
        }
    }
    // console.log(users);
    const addedBy = users.find(user => user.id === driver?.user.created_by)

    const handleUpdate = ()=>{
        navigate(`updateDriver`)
    }

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
                                        <span><img src={`${MyBaseUrl}${driver.user?.profile_image}`} /></span>
                                        <span>Name : {driver.user?.first_name} {driver.user?.last_name}</span>
                                        <br />
                                        <span>Email : {driver.user?.email}</span>
                                        <br />
                                        <span>Date of Birth : {driver.user?.date_of_birth}</span>
                                        <br />
                                    </div>

                                    <div style={detail}>
                                        <span style={{ width: "222px", color: "blue" }}>
                                            <a href={driver.license} download={driver.license}>{driver.license.split("/")[3]}</a>
                                            </span>

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
                                    <div style={detail}>
                                       <span>Added By : {addedBy?.username}</span>
                                        
                                    </div>

                                </div>

                    }

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px' }}>
                    <Button variant="primary" onClick={handleUpdate}>Update</Button>
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