import { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { refreshAccessToken } from '../authenticate/auth';
import RegisterDriverProfile from './driver_profile';
import api from '../Api';

export default function RegisterUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        password: "",
        confirm_password: "",
        role: '',
    })
    const inputValue = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const [image, setImage] = useState()

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)



    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirm_password) {
            alert("Passwords do not match")
            return;
        }
        const AllData = new FormData()
        AllData.append('first_name', formData.first_name)
        AllData.append('last_name', formData.last_name)
        AllData.append('email', formData.email)
        AllData.append('date_of_birth', formData.dob)
        AllData.append('password', formData.password)
        AllData.append('role', formData.role)
        if (image) {
            AllData.append('profile_image', image)
        }
        const access = localStorage.getItem('access')
        try {
            const response = await api.post('api/register/', AllData, {
                headers: {
                    'Authorization': `Bearer ${access}`,

                }
            })
            // data = response.data
            console.log(response.data.data?.id)
            const v = localStorage.setItem('vehicles', JSON.stringify(response.data.vehicle))
            const d = localStorage.setItem('driver', JSON.stringify(response.data.data))
            console.log(d);

            setLoading(false)
            if (formData.role == 'manager') {
                navigate('/home/managers')
            } else if (formData.role == 'driver') {
                navigate(`/home/registerDriver/${response.data.data?.id}`)
            } else {
                navigate('/')
            }
        } catch (error) {
            if (error.response?.status == 401) {
                const refresh = await refreshAccessToken()
                if (refresh) {
                    const retry = await api.post('api/register/', AllData, {
                        headers: {
                            'Authorization': `Bearer ${refresh}`,
                        }
                    });
                    if (formData.role == 'manager') {
                        navigate('/home/managers')
                    } else if (formData.role == 'driver') {
                        navigate(`/home/registerDriver/${retry.data.data?.id}`)
                    } else {
                        navigate('/')
                    }
                } else {
                    console.log(error.response.data)
                    localStorage.removeItem('access')
                    navigate('/')

                }
            } else {
                console.log(error.response.data)
            }
        } finally {
            setLoading(false)
        }
    };


    const userRole = user.role

    console.log(formData);


    return (
        <div style={containerStyle} >
            <Form style={loginForm} onSubmit={handleSubmit} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Add User</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" style={{ marginTop: "auto" }}>
                        <Form.Label style={label}>Role</Form.Label>
                        <select name='role' onChange={inputValue} >
                        <option value="">Select Role</option>
                            {
                                userRole === 'admin' ? <option value="admin">Admin</option> : null
                            }
                            <option value="manager">Manager</option>
                            <option value="driver">Driver</option>
                        </select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label style={label}>Email address</Form.Label>
                        <Form.Control style={Input} type="email" name='email' placeholder="Enter email" value={formData.email} onChange={inputValue} />
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter First Name" name='first_name' value={formData.first_name} onChange={inputValue} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Last Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Last Name" name='last_name' value={formData.last_name} onChange={inputValue} />
                    </Form.Group>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Date of Birth</Form.Label>
                        <Form.Control style={Input} type="date" name='dob' value={formData.dob} onChange={inputValue} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Image</Form.Label>
                        <Form.Control style={Input} accept='.jpeg,.jpg,.png' name='image' type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </Form.Group>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Password</Form.Label>
                        <Form.Control style={Input} type="password" placeholder="Enter Password" name='password' value={formData.password} onChange={inputValue} />
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Confirm Password</Form.Label>
                        <Form.Control style={Input} type="password" placeholder="Enter Confirm Password" name='confirm_password' value={formData.confirm_password} onChange={inputValue} />
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
