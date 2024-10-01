
import {useDispatch, useSelector} from 'react-redux';
import './UserNavBar.scss';
import {logoutUser} from '../../../redux/slices/authSlice';
import { useNavigate } from 'react-router';

function UserNavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser()).then(()=>{
      navigate('/login');
    });
  };
  return (
    <div className="user-nav-container">
     {/*  <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Text>
            Signed in as: <a href="#login">{user?.Name}</a>
          </Navbar.Text>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
    </div>
  );
}

export default UserNavBar;
