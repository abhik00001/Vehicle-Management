import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { refreshAccessToken } from "../authenticate/auth";
import api from "../Api";

export default function MyProfileUpdate() {
    const [userDetail, setUserDetail] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('access')
        const fetchData = async () => {
            try {
                const response = await api.get('api/user/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setUserDetail(response.data)
            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshAccessToken()
                    if (newToken) {
                        const response = await api.get('api/user/profile/', {
                            headers: {
                                'Authorization': `Bearer ${newToken}`
                            }
                        })
                        setUserDetail(response.data)
                    } else {
                        localStorage.removeItem('access')
                        navigate('/login')
                    }
                } else {
                    console.log(error)
                }
            }
        }
        fetchData()
    }, [])
    // console.log(user);
    
    // const [userDetail, setUserDetail] = useState({
    //     first_name: user.first_name,
    //     last_name: user.last_name,
    //     email: user.email,
    //     date_of_birth: user.date_of_birth,
    // })
    console.log(userDetail);
    
    const [image, setImage] = useState(null)
    const handleInput = (e) => {
        setUserDetail({ ...userDetail, [e.target.name]: e.target.value })
    }



    const handleCancel = () => {
        navigate('/home/MyProfile')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const access = localStorage.getItem('access')
        const formData = new FormData()
        formData.append('first_name', userDetail.first_name)
        formData.append('last_name', userDetail.last_name)
        formData.append('email', userDetail.email)
        formData.append('date_of_birth', userDetail.date_of_birth)
        if (image) {
            formData.append('profile_image', image)
        }
        try {
            const response = await api.patch(`api/updateProfile/`, formData, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            alert('Data Change Successfully')
            navigate('/home/MyProfile')
        } catch (error) {
            if (error.response?.status === 401) {
                const newToken = await refreshAccessToken()
                if (newToken) {
                    const response = await api.patch(`api/updateProfile/`, formData, {
                        headers: {
                            'Authorization': `Bearer ${newToken}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                    alert('Data Change Successfully')
                    navigate('/home/MyProfile')
                } else {
                    console.log('refresh unsuccessful');
                    localStorage.removeItem('access')
                    navigate('/')
                }
            } else {
                console.log(error);

            }
        }
    }

    return (
        <div style={styles}>

            <h2 style={{ textAlign: "center" }}>My Profile</h2>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Form style={loginForm} onSubmit={handleSubmit} >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {/* <img style={{ marginBottom: "4px" }} src={`http://localhost:8000/${user.profile_image}`} /> */}
                        <Form.Group className="mb-3">
                            {/* <Form.Label style={label}> Profile Image</Form.Label> */}
                            <Form.Control style={Input} type="file" accept=".jpeg,.jpg" onChange={(e) => setImage(e.target.files[0])} />
                            <p style={{ margin: '8px', color: 'blue' }}>{image ? image.name : null}</p>
                        </Form.Group>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Group className="mb-3">
                            <Form.Label style={label}> First Name</Form.Label>
                            <Form.Control style={Input} type="text" placeholder="Enter your first name" value={userDetail.first_name} name="first_name" onChange={handleInput} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={label}> Last Name</Form.Label>
                            <Form.Control style={Input} type="text" placeholder="Enter your last name" value={userDetail.last_name}
                                name="last_name" onChange={handleInput} />
                        </Form.Group>


                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Form.Group className="mb-3">
                            <Form.Label style={label}> Email </Form.Label>
                            <Form.Control style={Input} type="text" placeholder="Enter your email" value={userDetail.email} name="email" onChange={handleInput} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={label}> Date OF Birth</Form.Label>
                            <Form.Control style={Input} type="date" value={userDetail.date_of_birth} name="date_of_birth" onChange={handleInput} />
                        </Form.Group>


                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px' }}>
                        <Button className='mb-3' variant="primary" type="submit" >
                            Submit
                        </Button>
                        <Button className='mb-3' variant="danger" type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}



const loginForm = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "50%",
    marginTop: "auto",
    alignItems: 'center'
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

// const button = {
//     width: "100%",
//     padding: "10px",
//     backgroundColor: "#007bff",
//     border: "none",
//     borderRadius: "5px",
//     color: "#ffffff",
//     fontSize: "16px",
//     cursor: "pointer",
// }
const styles = {
    width: "80%",
    // border:"2px solid green",
    margin: "20px auto",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
}
