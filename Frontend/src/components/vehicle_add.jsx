import { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { refreshAccessToken } from '../authenticate/auth';
import api from '../Api';

export default function AddVehicle() {

    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        type:'',
        name:'',
        year:'',
        model:'',
        chassi:'',
        registration:'',
    })
    const handleForm= (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const [image,setImage] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const AllData = new FormData()
        AllData.append('vehicle_type',formData.type)
        AllData.append('vehicle_name',formData.name)
        AllData.append('vehicle_year',formData.year)
        AllData.append('vehicle_model',formData.model)
        AllData.append('vehicle_chassiNumber',formData.chassi)
        AllData.append('vehicle_registration',formData.registration)
        if (image){
            AllData.append('vehicle_photos',image)
        }
        const access = localStorage.getItem('access')
        try {
            const response = await api.post('api/vehicle/register', AllData, {
                headers: {
                    Authorization: `Bearer ${access}`,
                    // ContentType: "multipart/form-data"
                }
            })

            navigate('/home/vehicles')

        } catch (error) {
            if (error.response?.status == 401) {
                const newAccess = await refreshAccessToken()
                if (newAccess) {
                    const retry = await api.post('api/vehicle/register', AllData, {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`,
                            // 'Content-Type': "multipart/form-data"
                        }
                    })
                    navigate('/home/vehicles')
                }else{
                    console.log('new Access Token Fail')
                    localStorage.removeItem('access')
                    navigate('/')
                }
            }else{
                console.log(error,"does not valid")
            }
        }
    }

    return (
        <div style={containerStyle} >
            <Form style={loginForm} onSubmit={handleSubmit} encType="multipart/form-data">
                <h2 style={{ textAlign: "center", color: "#333333", }}>Add Driver Details</h2>
                <hr />

                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Vehicle Type</Form.Label>
                        <Form.Select style={Input} type="text" name='type' onChange={handleForm}>
                            <option value="">--Type--</option>
                            <option value="LTV">LTV</option>
                            <option value="HTV">HTV</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Vehicle Name</Form.Label>
                        <Form.Control style={Input} type="text" name='name' value={formData.name} onChange={handleForm} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Vehicle Year</Form.Label>
                        <Form.Control style={Input} type="number" name='year' value={formData.year} onChange={handleForm}/>
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Model</Form.Label>
                        <Form.Control style={Input} type='text' name='model' value={formData.model} onChange={handleForm}/>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Image</Form.Label>
                        <Form.Control style={Input} accept=".jpeg,.png,.jpg" name='image' type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Chassi Number</Form.Label>
                        <Form.Control style={Input} type='text' name='chassi' value={formData.chassi} onChange={handleForm} />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Registration Number</Form.Label>
                        <Form.Control style={Input} type='text' name='registration' value={formData.registration} onChange={handleForm}/>
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
    height: "60vh",
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
