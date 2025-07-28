import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router';
import { refreshAccessToken } from '../authenticate/auth';
import api, { MyBaseUrl } from '../Api';

export default function DriverUpdate() {
    const { driverID } = useParams()
    const [profileID, setProfileID] = useState('')
    const navigate = useNavigate()
    const vehicles = JSON.parse(localStorage.getItem('vehicles'))
    const [allData, setAlldata] = useState([])
    const [details, setDetails] = useState({
        user: '',
        address: '',
        experience: '',
        expiry: '',
        license: null,
        vehicle_assigned: ''
    })

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
                const data = response.data.data
                // console.log(data.id);
                setProfileID(data.id)

                setAlldata(data);

                setDetails({
                    user: data.user?.id,
                    address: data.address,
                    experience: data.experience,
                    expiry: data.license_exp,
                    vehicle_assigned: data.vehicle_assigned?.id || ''
                })

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
                        const data = response.data.data

                        setAlldata(data)
                        setDetails({
                            user: data.user?.id,
                            address: data.address,
                            experience: data.experience,
                            expiry: data.expiry,
                            vehicle_assigned: data.vehicle_assigned?.id
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

    const handleUpdate = async (e) => {

         e.preventDefault(); 
        const access = localStorage.getItem('access')
        const formData = new FormData()
        formData.append('user', details.user)
        formData.append('address', details.address)
        formData.append('experience', details.experience)
        formData.append('license_exp', details.expiry)
        formData.append('vehicle_assigned', details.vehicle_assigned)
        if (details.license ) {
            formData.append('license', details.license)
        }
        try {
            const response = await api.put(`api/drivers/${driverID}/update/${profileID}`, formData, {
                headers: {
                    'Authorization': `Bearer ${access}`,
                }
            })
            // console.log(response.data)
            navigate("/home/drivers")
        } catch (error) {
            if (error.response?.status === 401) {
                const newAccess = await refreshAccessToken()
                if (newAccess) {
                    const response = await api.put(`api/drivers/${driverID}/update/${profileID}`, formData, {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`
                        }
                    })
                    // console.log(response.data)
                    navigate("/home/drivers")
                } else {
                    console.log('retry unsuccessfull');
                    localStorage.removeItem('access')
                    navigate("/")
                }
            } else {
                console.log(error)
            }
        }

    }

    // console.log(details);

    const handleInput = (e) => {
        setDetails((previous) => ({
            ...previous, [e.target.name]: e.target.value
        }))
    }
    const handleFileInput = (e) => {
        setDetails((previous) => ({
            ...previous, [e.target.name]: e.target.files[0]
        }))
    }

    return (
        <div style={containerStyle} >
            <Form style={loginForm} encType="multipart/form-data" onSubmit={handleUpdate} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>Update Driver Details</h2>
                <hr />

                <div style={{ display: "flex", justifyContent: "space-between" }}>


                    <img style={{ width: "25%" }} src={`${MyBaseUrl}${allData.user?.profile_image}`} />


                    <Form.Group className="mb-3">
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" name='first_name' value={allData?.user?.first_name || ''} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>First Name</Form.Label>
                        <Form.Control style={Input} type="text" name='last_name' value={allData.user?.last_name || ''} disabled />
                    </Form.Group>
                    <div style={{ width: '20%', alignItems: 'center', marginTop: "2rem" }}>
                        <Link to={ `/home/updateUser/${allData.user?.id}`}>
                            <Button >Update User</Button>
                        </Link>
                    </div>
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Vehicle Assign</Form.Label>
                        <Form.Select style={Input} type="text" name='vehicle_assigned' value={details.vehicle_assigned} onChange={handleInput} >
                            <option value="">-- Select Vehicle --</option>
                            {
                                vehicles.map((item) =>

                                    <option key={item?.id} value={item?.id} >{item?.vehicle_name}
                                    </option>

                                )

                            }

                        </Form.Select>
                    </Form.Group>

                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3" >
                        <Form.Label style={label}>Driving License</Form.Label>
                        <Form.Control style={Input} accept="application/pdf" name='license' type="file" onChange={handleFileInput} />
                        <a >{allData.license?.split('/').pop()}</a>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>License Expiry Date</Form.Label>
                        <Form.Control style={Input} type="date" name='expiry' value={details.expiry} onChange={handleInput} />
                    </Form.Group>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Experience</Form.Label>
                        <Form.Control style={Input} name='experience' type="number" value={details.experience} onChange={handleInput} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={label}>Address</Form.Label>
                        <Form.Control style={Input} name='address' type="text" value={details.address} onChange={handleInput} />
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

