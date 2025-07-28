import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router';
import { refreshAccessToken } from '../authenticate/auth';
import '../css/vehicles.css'
import api, { MyBaseUrl } from '../Api';



export default function Managers() {
    const [managers, setManagers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchValue, setSearchValue] = useState('')
    const navigate = useNavigate()

    
    async function getManagers(search = '') {
        const access = localStorage.getItem('access')
        try {
            const response = await api.get(`api/managers/?search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            setManagers(response.data)
            setLoading(false)
        } catch (error) {
            if (error.response?.status == 401) {
                const newAccess = await refreshAccessToken()
                if (newAccess) {
                    const retry = await api.get('api/managers/', {
                        headers: {
                            'Authorization': `Bearer ${newAccess}`
                        }
                    })
                    setManagers(retry.data)
                } else {
                    console.log('Access token is invalid')
                    navigate('/')
                }
            } else {
                console.log(error)
                navigate('/')
            }
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getManagers()
    }, [])

    const handleSearch = ()=>{
        setLoading(true)
        getManagers(searchValue)
        setLoading(false)
    }

    return (
        <>
            <div style={styles}>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ margin: "12px", }}>
                        <Link to="/home/registerUser"><Button>Add Manager</Button></Link>
                    </div>
                    <h2>Managers</h2>
                    <div style={{ margin: "12px", }}>
                        <input type="text" name="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        <Button style={{ marginLeft: "12px" }} onClick={handleSearch}>Search</Button>
                    </div>
                </div>
                <hr />

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>
                    {
                        loading ? <h3>Loading...</h3> :
                            managers.map((manager, index) => {
                                return (

                                    <Card key={index} style={{ width: '20rem', marginBottom: "10px" }}>
                                        <Card.Img variant="top" src={`${MyBaseUrl}${manager.profile_image}`} />
                                        <Card.Body>
                                            <Card.Title style={{ textTransform: "capitalize", textAlign: "center" }}>{manager.first_name} {manager.last_name}</Card.Title>
                                            <Card.Text>
                                                <span>Email : {manager.email}</span>
                                            </Card.Text>
                                            <div style={{ textAlign: "center" }}>

                                                <Link to={`${manager.id}`} >
                                                    <Button variant="primary">
                                                        Details
                                                    </Button>
                                                </Link>

                                            </div>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                    }


                </div>
            </div>
        </>
    )
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