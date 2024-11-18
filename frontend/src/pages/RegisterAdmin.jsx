import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    // Kicks you if you're not logged in and only shows you the menus you have access to
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        setPermissions(JSON.parse(localStorage.getItem('permissions')));

        if (!permissions) {
            navigate('/login');
            console.error("You don't have perms");
            return;
        }

        if (permissions && permissions['register-admin'] === false) {
            navigate('/login');
            console.error("You don't have the right permission");
        }
    }, [navigate, permissions]);

    async function submit_register() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;

        if (confirm !== password) {
            document.getElementById('error').innerHTML =
                'Passwords do not match';
            return;
        }

        await fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/users/register-admin`,
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
            .then((res) => {
                if (res.status === 201) {
                    return res.json().then((data) => {
                        console.log(data); // Log the parsed JSON data
                        navigate('/login'); // Redirect to login
                    });
                }
                res.json().then((j) => {
                    document.getElementById('error').innerHTML = j;
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div>
            <h1>Register Admin</h1>
            <div id={'register_fields'}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" /> <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" /> <br />
                <label htmlFor="confirm">Confirm Password:</label>
                <input type="password" id="confirm" name="confirm" />
                <p id={'error'}></p>
                <input type="submit" onClick={submit_register} value="Submit" />
            </div>
        </div>
    );
}

export default Register;
