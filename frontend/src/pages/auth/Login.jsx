import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../other/UserContext.jsx';
import '../../styles/pages/Login.css';

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
                        window.location.replace('/');
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

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            submit_login();
        }
    }

    return (
        <div>
            <div id={'login_fields'}>
                <label htmlFor="user">Username:</label>
                <input
                    type="text"
                    id="user"
                    name="user"
                    onKeyPress={handleKeyPress}
                />
                <br />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onKeyPress={handleKeyPress}
                />
                <p id={'error'}></p>
                <input type="submit" onClick={submit_login} value="Submit" />
            </div>
        </div>
    );
};

export default Login;
