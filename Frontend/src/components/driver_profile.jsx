import { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { refreshAccessToken } from '../authenticate/auth';
import api from '../Api';


export default function RegisterDriverProfile() {
    const vehicle = JSON.parse(localStorage.getItem('vehicles'))
    const driver = JSON.parse(localStorage.getItem('driver'))
    const { driverUsername } = useParams();
    const [details, setDetails] = useState({
        user: JSON.stringify(driver?.id),
        vehicle_assign: "",
        expiry: "",
        experience: "",
        address: "",
    })
    console.log(details);

    const [license, setLicense] = useState()

    const inputValue = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value })
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            alert("Only PDF files are allowed.");
            return;
        }
        setLicense(file);
    };

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        console.log(vehicle)
        e.preventDefault();
        const access = localStorage.getItem('access')
        const AllData = new FormData()
        AllData.append('user', details.user)
        AllData.append('vehicle_assigned', details.vehicle_assign)
        AllData.append('license_exp', details.expiry)
        AllData.append('experience', details.experience)
        AllData.append('address', details.address)
        if (license){
            AllData.append('license', license)
        }
        try {
            const response = await api.post('api/driver/register', AllData, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log(response.data)
            localStorage.removeItem('driver')
            navigate('/home/drivers')
        } catch (error) {
            if (error.response?.status == 401) {
                const newAccess = await refreshAccessToken();
                if (newAccess) {
                    const retry = await api.post("api/driver/register", AllData, {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`,
                            'Content-Type': 'multipart/form-data',

                        }
                    })
                    console.log(retry.data)
                    localStorage.removeItem('driver')
                    navigate("/home/drivers")
                } else {
                    console.log("Access token is invalid")
                    localStorage.removeItem('access')
                    navigate('/')
                }
            }
        }
    }

    console.log(driver);


    return (
        <div style={containerStyle} >
            <Form style={loginForm} onSubmit={handleSubmit} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Add Driver Details</h2>
                <hr />


                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>User</Form.Label>
                        <Form.Control style={Input} placeholder={driver?.username} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Assign</Form.Label>
                        <Form.Select style={Input} type="text" name='vehicle_assign' value={details.vehicle_assign} onChange={inputValue}>
                            <option value="">-- Select Vehicle --</option>
                            {
                                vehicle.map((item) =>

                                <option key={item?.id} value={item?.id}>{item?.vehicle_name} </option>

                                )
                            }

                        </Form.Select>
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Driving License</Form.Label>
                        <Form.Control style={Input} accept="application/pdf" name='license' type="file" onChange={handleFileChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>License Expiry Date</Form.Label>
                        <Form.Control style={Input} type="date" name='expiry' value={details.expiry} onChange={inputValue} />
                    </Form.Group>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Experience</Form.Label>
                        <Form.Control style={Input} name='experience' type="number" value={details.experience} onChange={inputValue} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Address</Form.Label>
                        <Form.Control style={Input} name='address' type="text" value={details.address} onChange={inputValue} />
                    </Form.Group>
                </div>

                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
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
    width: "50%",
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

