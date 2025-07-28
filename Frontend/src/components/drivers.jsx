import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { refreshAccessToken } from '../authenticate/auth';
import '../css/vehicles.css'
import { Link } from 'react-router';
import api, { MyBaseUrl } from '../Api';

export default function Driver() {
    const [drivers, setDriver] = useState([]);
    const [loading, setLoading] = useState(true)
    const [searchValue,setSearchValue] = useState('')
    async function fetchDrivers(query = '') {
            const access = localStorage.getItem('access')
            try {
                const response = await api.get(`api/drivers/?search=${query}`, {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                })
                setDriver(response.data)
                setLoading(false)

            }
            catch (error) {
                if (error.response?.status == 401) {
                    const refreshToken = await refreshAccessToken()
                    if (refreshToken) {
                        try {
                            const retry = await api.get("api/drivers/", {
                                headers: {
                                    Authorization: `Bearer ${refreshToken}`
                                }
                            }
                            )
                            setDriver(retry.data)
                            setLoading(false)
                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        console.log("could not retry token");
                        navigate("/")
                    }
                } else {
                    console.error("API error:", error);
                }
            } finally {
                setLoading(false)
            }

        }
    useEffect(() => {
        fetchDrivers()
    }, [])

    function handleSearch(){
        fetchDrivers(searchValue)
    }

    return (
        <>
            <div style={styles}>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ margin: "12px", }}>
                        <Link to="/home/registerUser"><Button>Add Driver</Button></Link>
                    </div>
                    <h2 >Drivers</h2>
                    <div style={{ margin: "12px", }}>
                        <input type="text" name="search" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} />
                        <Button style={{marginLeft:"12px"}} onClick={handleSearch}>Search</Button>
                    </div>
                </div>
                <hr />

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>

                    {
                        loading ? <h4>Loading...</h4> :
                            drivers.map((driver, i) => {
                                return (
                                    <Card key={i} style={{ width: '18rem', marginBottom: "10px" }}>
                                        <Card.Img variant="top" src={`${MyBaseUrl}${driver.profile_image}`} />
                                        <Card.Body>
                                            <Card.Title style={{ textAlign: "Center", textTransform: "uppercase" }} >{driver.first_name} {driver.last_name}</Card.Title>
                                            <Card.Text>
                                                <span>Email: {driver.email}</span>
                                                <span>Date of Birth: {driver.date_of_birth}</span>
                                            </Card.Text>
                                            <div style={{ textAlign: "center" }}>

                                                <Link to={`${driver.id}`}>
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