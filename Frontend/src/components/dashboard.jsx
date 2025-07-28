import { useEffect, useState } from "react"
import { refreshAccessToken } from "../authenticate/auth"
import { useNavigate } from "react-router"
import axios from "axios"
import api from "../Api"


export default function Dashboard() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const access = localStorage.getItem('access')
        const fetchDashboard = async () => {
            try {

                const response = await api.get("api/dashboard", {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                })

                setUserData(response.data)
                // console.log(response.data);


                setLoading(false)

            } catch (error) {
                if (error.response?.status == 401) {
                    const refresh_token = await refreshAccessToken()
                    if (refresh_token) {
                        try {
                            const retry = await api.get("dashboard", {
                                headers: {
                                    Authorization: `Bearer ${refresh_token}`
                                }
                            })
                            setUserData(retry.data)
                            setLoading(false)
                        } catch (retryError) {
                            console.log(retryError)
                            navigate('/')
                        }
                    }
                } else {
                    console.log("refresh token fail", error)
                    // localStorage.removeItem('access')
                    navigate('/')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()

    }, [])
    // console.log(userData);

    const role = userData?.user?.role

    return (
        <>
            <div style={styles}>

                <h2 style={{ textAlign: "center" }}>Dashboard</h2>
                <hr />

                {
                    loading ? <h4>Loading...</h4> :
                        <div>
                            <h3 style={{ textAlign: "initial", textTransform: "uppercase" }}>Welcome, Mr. {userData?.user?.first_name}</h3>
                        </div>

                }

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>

                    {(role == "admin" || role == "manager") && (
                        <div style={total_container}>
                            <span>Total Users : {userData?.total_users}</span>
                            <span>Total Admins : {userData?.total_admins}</span>
                            {
                                (role === "admin") && (
                                    <>

                                        <span>Total Managers : {userData?.total_managers}</span>
                                    </>
                                )
                            }
                            {/* {
                                (role === 'manager') && (
                                    <>
                                        <span>Total Managers : {userData?.total_managers}</span>

                                    </>

                                )
                            } */}
                            <span>Total Drivers : {userData?.total_drivers}</span>
                            <span>Total Vehicles : {userData?.total_vehicles}</span>

                        </div>


                    )}

                    {
                        (role == "driver") && (
                            <div style={total_container}>
                                <span>Vehicle Assigned : {
                                    userData?.driver_profile?.vehicle_assigned ?
                                        <div>
                                            <span><img src={`http://localhost:8000/${userData?.driver_profile?.vehicle_assigned?.vehicle_photos}`} style={{ width: '30', height: '90px',margin:'20px 0 0 20px',}} /></span>
                                            <div style={{ width: 'fit-content', display: 'flex', justifyContent: 'space-evenly', margin: '30px', flexWrap: 'wrap' }}>
                                                <span style={{padding:'0 0 0 20px'}}>Vehicle Name: {userData?.driver_profile?.vehicle_assigned?.vehicle_name}</span>
                                                <span style={{padding:'0 0 0 20px'}}>Vehicle Model: {userData?.driver_profile?.vehicle_assigned?.vehicle_model}</span>
                                                <span style={{padding:'0 0 0 20px'}}>Vehicle Registration: {userData?.driver_profile?.vehicle_assigned?.vehicle_registration}</span>
                                            </div>
                                        </div>
                                        : "No Vehicle Assigned"
                                }</span>
                            </div>
                        )
                    }

                </div>

                {(role == "admin" || role == "manager") && (
                    <>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                            <div style={total_container}>
                                {
                                    <>
                                        <span>Total Drivers : {userData?.total_drivers}</span>
                                        <br />
                                        <span>Assigned Drivers : {userData?.assigned_drivers}</span>
                                        <span>Unassigned Drivers : {userData?.unassigned_drivers}</span>
                                        <span>Total Drivers Added : {userData?.userAdded_drivers}</span>
                                    </>
                                }
                            </div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                            <div style={total_container}>
                                {
                                    <>
                                        <span>Total Vehicles : {userData?.total_vehicles}</span>
                                        <br />
                                        <span>Assigned Vehicles : {userData?.assigned_vehicle}</span>
                                        <br />
                                        <span>UnAssigned Vehicles : {userData?.unassigned_vehicle}</span>
                                        <br />
                                        <span>Total Vehicles Added : {userData?.userAdded_vehicles}</span>
                                    </>
                                }
                            </div>
                        </div>

                        {
                            (role == 'admin') && (

                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                                    <div style={total_container}>
                                        {
                                            <>
                                                <span>Total Managers : {userData?.total_managers}</span>
                                                <br />

                                                <span>Managers Added By User : {userData?.userAdded_managers}</span>
                                            </>
                                        }
                                    </div>
                                </div>
                            )
                        }

                    </>
                )}
            </div >
        </>
    )
}

const total_container = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    margin: "30px",
    boxShadow: "inset rgba(0, 0, 0, 0.1) 11px -5px 14px 3px",
    padding: "15px",
    borderRadius: "15px",
    flexWrap: "wrap"
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