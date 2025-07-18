import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router";
export default function ForgotPage(){
      return (
        <div style={containerStyle} >
            <Form style={passwordForm} >
                <h2 style={{ textAlign: "center", color: "#333333", }}>LOGIN</h2>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={label}>Email address</Form.Label>
                    <Form.Control style={Input} type="email" placeholder="Enter email" />
                </Form.Group>

                <Button className='mb-3' variant="primary" type="submit" style={button}>
                    Submit
                </Button>
                
                <p style={{textAlign:"center"}}><Link to={"/"}>Back</Link></p>
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
