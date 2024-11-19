import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../other/UserContext.jsx';

const Login = () => {
    const navigate = useNavigate();
    const { loggedIn, setLoggedIn, setUserId, setPermissions } =
        useContext(UserContext);

    useEffect(() => {
        if (loggedIn) {
            return navigate('/');
        }
    }, [loggedIn, navigate]);

    async function submit_login() {
        const username = document.getElementById('user').value;
        const password = document.getElementById('password').value;

        await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/users/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                res.json().then((j) => {
                    if (res.status === 200) {
                        localStorage.setItem('token', j['token']);
                        setPermissions(jwtDecode(j['token'])['permissions']);
                        setLoggedIn(true);
                        setUserId(jwtDecode(j['token'])['userId']);
                        navigate('/');
                        return;
                    }
                    document.getElementById('error').innerHTML = j['message'];
                });
            })
            .catch((err) => {
                setLoggedIn(false);
                setUserId('');
                setPermissions({});
                localStorage.clear();
                console.log(err);
            });
    }

    return (
        <div>
            <h1>Login</h1>
            <div id={'login_fields'}>
                <label htmlFor="user">Username:</label>
                <input type="text" id="user" name="user" /> <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" />
                <p id={'error'}></p>
                <input type="submit" onClick={submit_login} value="Submit" />
            </div>
        </div>
    );
};

export default Login;
