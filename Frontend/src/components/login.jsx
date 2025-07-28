import { useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import api from '../Api';

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error,setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("api/login/", {email, password}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // console.log(res.data)
            localStorage.setItem('access', res.data.access)
            localStorage.setItem('refresh', res.data.refresh)
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate("/home")
        }
        catch (err) {
            setError("*Invalid Credentails*")
        }
    }

    return (
        <div style={containerStyle} onSubmit={handleSubmit} >
            <Form style={loginForm} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>LOGIN</h2>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={label}>Email address</Form.Label>
                    <Form.Control style={Input} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={label}>Password</Form.Label>
                    <Form.Control style={Input} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Password" />
                </Form.Group>
                <p style={{color:"red"}}>{error}</p>
                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
                </Button>
                <p style={{ textAlign: "center" }}><Link to={"/forgot_password"}>Forgot Password?</Link></p>
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
    width: "30%"
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

export default LoginPage;