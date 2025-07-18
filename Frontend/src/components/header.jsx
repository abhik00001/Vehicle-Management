import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, NavLink, Outlet } from 'react-router';
import "../css/header.css"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Header() {
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login_page';
    };
    const user =  JSON.parse(localStorage.getItem('user'));
    const role = user?.role    
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href={"/"}>Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <NavLink className="link" to={""}>Dashboard</NavLink>
                       {(role === "admin" || role === "manager") && (
                        <>
                            <NavLink className="link" to={"vehicles"}>Vehicles</NavLink>
                            <NavLink className="link" to="drivers">Drivers</NavLink>
                        </>
                        )}
                        {(role === 'admin')&&(

                        <NavLink className="link" to="managers">Managers</NavLink>
                        )}
                    </Nav>
                    <Nav className="me">
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                <img style={{ width: "32px" }} src="https://img.icons8.com/?size=100&id=bzanxGcmX3R8&format=png&color=000000" alt="no img.." />
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ left: "-10px " }}>
                                <p style={{paddingLeft:'18px',textTransform:'uppercase',margin:0 , color:'darkgray'   }} aria-disabled>{user?.username}</p>
                                <hr style={{margin:2}}/>
                                <Dropdown.Item as={Link} to="Myprofile">My Profile</Dropdown.Item>
                                <Dropdown.Item as={Link} to={"passwordChange"}>Change Password</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>
            <Outlet />
        </>
    )
} 
