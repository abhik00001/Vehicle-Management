import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { refreshAccessToken } from '../authenticate/auth';

export default function DriverUpdate() {
    const { driverID } = useParams()
    const navigate = useNavigate()
    const vehicles = JSON.parse(localStorage.getItem('vehicles'))
    const [details, setDetails] = useState([])
    
    // const [users, setUsers] = useState([])
    useEffect(() => {
        const fetchDriver = async () => {
            const access = localStorage.getItem('access')
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/drivers/${driverID}/`, {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                })
                setDetails(response.data.data)
                
                // console.log(response.data.data?.vehicle_assigned)
            } catch (error) {
                if (error.response?.status === 401) {
                    const newAccess = await refreshAccessToken()
                    if (newAccess) {
                        const response = await axios.get(`http://127.0.0.0.1:8000/api/drivers/${driverID}`, {
                            headers: {
                                'Authorization': `Bearer ${newAccess}`
                            }
                        })
                    } else {
                        console.log('Access token is invalid')
                        localStorage.removeItem('access')
                        navigate("/")
                    }
                } else {
                    console.log(error)
                }
            }
        }
        fetchDriver()
    }, [driverID])


    return (
        <div style={containerStyle} >
            <Form style={loginForm} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Update Driver Details</h2>
                <hr />

                <div style={{ display: "flex", justifyContent: "space-between" }}>


                    <img style={{ width: "25%" }} src={`http://localhost:8000/${details.user?.profile_image}`} />


                    <Form.Group className="mb-3">
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" name='first_name' value={details?.user?.first_name || ''} disabled />
                    </Form.Group>
            
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" name='last_name' value={details.user?.last_name || ''} disabled />
                    </Form.Group>
                    <div  style={{ width: '20%', alignItems:'center',marginTop:"2rem" }}>
                        <Button >Update User</Button>
                    </div>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Assign</Form.Label>
                        <Form.Select style={Input} type="text" name='vehicle_assign'>
                            <option value="">-- Select Vehicle --</option>
                            {
                                vehicles.map((item) =>
                                    
                                    <option key={item?.id} value={item?.id} disabled={item?.is_assigned === true}>{item?.vehicle_name} {console.log(!!item?.is_assigned)}
                                    </option>
                                    
                                    

                                )
                                
                            }

                        </Form.Select>
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Driving License</Form.Label>
                        <Form.Control style={Input} accept="application/pdf" name='license' type="file" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>License Expiry Date</Form.Label>
                        <Form.Control style={Input} type="date" name='expiry' />
                    </Form.Group>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Experience</Form.Label>
                        <Form.Control style={Input} name='experience' type="number" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Address</Form.Label>
                        <Form.Control style={Input} name='address' type="text" />
                    </Form.Group>
                </div>

                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Update Driver Details
                </Button>
            </Form>
        </div>
    );
}

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
}
const loginForm = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "66%",
    marginTop: "auto"
}

const label = {
    fontWeight: "bold",
    color: "#555555",
}

const Input =
{
    width: "100%",
    padding: "10px",
    border: "1px solid #cccccc",
    borderRadius: "5px",

}

const button = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
}

