
import Button from 'react-bootstrap/Button'
import '../css/vehicles.css'
import { Link, UNSAFE_DataRouterContext, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { refreshAccessToken } from '../authenticate/auth'
import api, { MyBaseUrl } from '../Api'

export default function ManagerDetail() {
    const { managerID } = useParams()
    const navigate = useNavigate()
    const [manager, setManager] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    useEffect(() => {
        const access = localStorage.getItem('access')
        const fetchManager = async () => {
            try {
                const response = await api.get(`api/managers/${managerID}`, {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                })
                setManager(response.data.data)
                setUsers(response.data.user)
                setLoading(false)
            } catch (error) {
                if (error.response?.status == 401) {
                    const newAccess = await refreshAccessToken()
                    if (newAccess) {
                        const retry = await api.get(`api/managers/${managerID}`, {
                            headers: {
                                'Authorization': `Bearer ${newAccess}`
                            }
                        })
                        setManager(retry.data)
                        setUsers(response.data.user)
                        setLoading(false)
                    } else {
                        console.log('Failed to refresh token')
                        localStorage.removeItem('access')
                        navigate('/')
                    }
                }
            }
        }
        fetchManager()
    }, [])
    const added_by = users.find((user) => user.id === manager.created_by)

    const handleDelete = async (e)=>{
        e.preventDefault()
        const access = localStorage.getItem('access')
        try{
            const response = await api.delete(`api/delete_user/${managerID}`,{
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            console.log(response.data)
            navigate("/home/managers")
        }catch (error){
            if (error.response?.status == 401) {
                const newAccess = await refreshAccessToken()
                if (newAccess) {
                    const retry = await api.delete(`api/delete_user/${managerID}`,{
                        headers: {
                            'Authorization': `Bearer ${newAccess}`
                        }
                    })
                    navigate("/home/managers")
                }else{
                    console.log('Failed to refresh token')
                    localStorage.removeItem('access')
                    navigate('/')
                }
            }else{
                console.log('Failed to delete user')

            }
        }

    }

    return (
        <>
            <div style={styles}>

                <h2 style={{ textAlign: "center" }}>Manager</h2>
                <hr />

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                }}>
                    {
                        loading ? <h3>Data Loading.. </h3>:
                        error ? <h3>User Not Exist</h3> :
                            <div >
                                <div style={detail}>
                                    <span><img src={`${MyBaseUrl}${manager.profile_image}`} /></span>
                                    <span>Name :{manager.first_name} {manager.last_name}</span>
                                    <br />
                                    <span>Email : {manager.email} </span>
                                    <br />

                                    <br />
                                </div>
                                <div style={detail}>
                                    <span>Date of Birth : {
                                        new Date(manager.date_of_birth).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                        })
                                    }</span>
                                    <span>Added By : {added_by?.first_name} {added_by?.last_name}</span>
                                    <br />
                                    <span>Joined On : {
                                        new Date(manager.joined_on).toLocaleDateString('en-GB', {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        }).replaceAll('/', '-')
                                    } </span>
                                    <br />

                                    <br />
                                </div>

                            </div>

                    }
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '20px' }}>
                    <Link to={`/home/updateUser/${manager.id}`}>
                        <Button variant="primary" >Update</Button>
                    </Link>
                    <Button variant="danger" onClick={handleDelete} >Delete</Button>
                </div>
            </div>
        </>
    )
}

const detail = {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
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