import { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link,  useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { refreshAccessToken } from '../authenticate/auth';


export default function RegisterDriverProfile(){
    const {driverUsername} = useParams();
    const [details,setDetails] = useState({
        user:{driverUsername},
        vehicle_assign:"",
        expiry:"",
        experience:"",
        address:"",
    })
    const [license,setLicense] = useState()
    const inputValue = (e)=>{
        setDetails({...details,[e.target.name]:e.target.value})
    }

    
     return (
        <div style={containerStyle} >
            <Form style={loginForm}  >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Add Driver Details</h2>
                <hr />

               
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>User</Form.Label>
                        <Form.Control style={Input} name={driverUsername} placeholder={driverUsername} disabled/>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Assign</Form.Label>
                        <Form.Control style={Input} type="text" name='vehicle_assign' value={details.vehicle_assign} onChange={inputValue}/>
                    </Form.Group>

                </div>

                 <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Driving License</Form.Label>
                        <Form.Control style={Input} name='license' type="file" onChange={(e)=>setLicense(e.target.file[0])}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>License Expiry Date</Form.Label>
                        <Form.Control style={Input} type="date" name='expiry' value={details.expiry} onChange={inputValue}/>
                    </Form.Group>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Experience</Form.Label>
                        <Form.Control style={Input} name='experience' type="number" value={details.experience} onChange={inputValue}/>
                    </Form.Group>
                    
                   <Form.Group className="mb-3">
                        <Form.Label style={label}>Address</Form.Label>
                        <Form.Control style={Input} name='address' type="text" value={details.address} onChange={inputValue}/>
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
    marginTop:"auto"
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

