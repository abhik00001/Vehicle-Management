import { Button } from "react-bootstrap";
import MyProfileUpdate from "./my_profile_update";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { refreshAccessToken } from "../authenticate/auth";
import axios from "axios";
import api, { MyBaseUrl } from "../Api";

export default function MyProfile() {
    const [user, setUser] = useState([])
    // const [updateBox, setUpdateBox] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('access')
        const getUser = async () => {
            try {
                const response = await api.get('api/user/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                // console.log(response.data);
                
                setUser(response.data)
            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshAccessToken()
                    if (newToken) {
                        const response = await api.get('api/user/Profile/', {
                            headers: {
                                'Authorization': `Bearer ${newToken}`
                            }
                        })
                        setUser(response.data)
                    }else{
                        console.log('refresh token fail');
                        localStorage.removeItem('access')
                        navigate('/')
                        
                    }
                }else{
                    console.log(error)
                }
            }
        }
        getUser()
    },[])
    const handleButton = () => {
        navigate('/home/MyProfileUpdate')
    }
    // console.log(user);


    return (
        <>
            <div style={styles}>

                <h2 style={{ textAlign: "center" }}>My Profile</h2>
                <hr />

                {/* {
                    updateBox? <MyProfileUpdate /> : 

                } */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", }}>
                    <div style={detail}>
                        <span ><img src={`${MyBaseUrl}${user.profile_image}`} /></span>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                        }}>
                            <span >First Name : {user.first_name}</span>
                            <br />
                            <span >Last Name : {user.last_name}</span>
                            <br />
                            <span >Email : {user.email}</span>
                            <br />
                            <span >Date of Birth : {user.date_of_birth}</span>
                            <br />
                        </div>

                    </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px' }}>
                    <Button variant="primary" onClick={handleButton}>Update Profile</Button>

                    {/* {
                        updateBox ? <Button variant="danger" onClick={() => setUpdateBox(!updateBox)}>Cancel</Button> : <Button variant="primary" onClick={() => setUpdateBox(!updateBox)}>Update Profile</Button>
                    } */}
                </div>
            </div>
        </>
    )
}

const detail = {
    width: "100%",
    display: "flex",
    // flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "20px",
    // border:".5px solid black",
    boxShadow: "inset rgba(0, 0, 0, 0.2) -5px -3px 18px 0rem",

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

