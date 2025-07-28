import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router";
import { refreshAccessToken } from "../authenticate/auth";
import api from "../Api";
export default function ForgotPage() {
    
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('api/user/forgotPassword/', { email })
            alert(response.data.message);
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div style={containerStyle} >
            <Form style={passwordForm} onSubmit={handleSubmit}>
                <h2 style={{ textAlign: "center", color: "#333333", }}>Forgot Password</h2>
                <hr />
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={label}>Email address</Form.Label>
                    <Form.Control style={Input} type="email" value={email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
                </Button>

                <p style={{ textAlign: "center" }}><Link to={"/"}>Back</Link></p>
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
const passwordForm = {
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
