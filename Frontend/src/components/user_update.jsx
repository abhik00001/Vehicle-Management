import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { refreshAccessToken } from "../authenticate/auth";
import api from "../Api";
export default function Update_User() {
    const navigate = useNavigate()
    const { userId } = useParams()
    const user = JSON.parse(localStorage.getItem('user'))
    const userRole = user.role
    // const [allData, setAllData] = useState({})

    const [updateData, setUpdateData] = useState({
        role: '',
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: '',
        profile_image: null,

    })
    useEffect(() => {
        const access = localStorage.getItem('access')
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/fetchUser/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                })
                const data = response.data
                // console.log(data);
                setUpdateData({
                    role: data.role,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    date_of_birth: data.date_of_birth,
                    profile_image: data.profile_image || ''
                })


            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshAccessToken()
                    if (newToken) {
                        const retry = await axios.get(`http://localhost:8000/api/fetchUser/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${access}`
                            }
                        })
                        const data = retry.data
                        // console.log(data);
                        setUpdateData({
                            role: data.role,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
                            date_of_birth: data.date_of_birth,
                            profile_image: data.profile_image || ''
                        })

                    } else {
                        console.log('Refresh Token Failed');
                        localStorage.removeItem('access')
                        navigate('/')
                    }
                } else {
                    console.log(error);

                }
            }
        }
        fetchData()
    }, [userId])

    console.log(updateData);

    const InputChange = (e) => {
        if (e.target.type === 'file') {
            setUpdateData((prev) => ({
                ...prev, [e.target.name]: e.target.files[0]
            }))
        }
        else {
            setUpdateData((prev) => ({
                ...prev, [e.target.name]: e.target.value
            }))

        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const access = localStorage.getItem('access')
        const form = new FormData()
        form.append("role", updateData.role)
        form.append("first_name", updateData.first_name)
        form.append("last_name", updateData.last_name)
        form.append("email", updateData.email)
        form.append("date_of_birth", updateData.date_of_birth)
        if (updateData.profile_image instanceof File) {
            form.append("profile_image", updateData.profile_image)
        }

        try {
            const response = await api.patch(`api/update_user/${userId}`, form, {
                headers: {
                    "Authorization": `Bearer ${access}`,
                }
            })
            console.log(response.data);
            
            alert('Data Updated successfull')
            navigate('/home')

        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await refreshAccessToken()
                if (newAccess) {
                    const response = await api.patch(`api/update_user/${userId}`, form, {
                        headers: {
                            Authorization: `Bearer ${newAccess}`,
                        }
                    })
                    alert('Data Updated successfull')
                    navigate('/')
                }else{
                    console.log('retry unsuccessfull');
                    navigate('/')
                }
            }else{
                console.log(error);
            }
        }
    }
    return (
        <div style={containerStyle} >
            <Form style={loginForm} encType="multipart/form-data" onSubmit={handleUpdate}>
                <h2 style={{ textAlign: "center", color: "#333333", }}>Update User</h2>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" style={{ marginTop: "auto" }}>
                        <Form.Label style={label}>Role</Form.Label>
                        <select name='role' value={updateData.role} onChange={InputChange} >
                            {
                                userRole === 'admin' ? <option value="admin">Admin</option> : null
                            }
                            <option value="manager">Manager</option>
                            <option value="driver">Driver</option>
                        </select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label style={label}>Email address</Form.Label>
                        <Form.Control style={Input} type="email" name='email' placeholder="Enter email" value={updateData.email} onChange={InputChange} />
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter First Name" name='first_name' value={updateData.first_name} onChange={InputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Last Name</Form.Label>
                        <Form.Control style={Input} type="text" placeholder="Enter Last Name" name='last_name' value={updateData.last_name} onChange={InputChange} />
                    </Form.Group>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Date of Birth</Form.Label>
                        <Form.Control style={Input} type="date" name='date_of_birth' value={updateData.date_of_birth} onChange={InputChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Image</Form.Label>
                        <Form.Control style={Input} accept='.jpeg,.jpg,.png' name='profile_image' type="file" onChange={InputChange} />
                        <a href={`http://localhost:8000/${updateData.profile_image}`} >{updateData.profile_image?.split('/').pop()}</a>
                    </Form.Group>
                </div>
                <hr />

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
    marginTop: "20px"
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


