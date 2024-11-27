import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../other/UserContext.jsx';
import '../styles/pages/Register.css';

function Register() {
    const navigate = useNavigate();

    const { loggedIn } = useContext(UserContext);

    if (loggedIn) {
        return navigate('/');
    }

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
            `${import.meta.env.VITE_API_BACKEND_URL}/api/users/register`,
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((res) => {
                if (res.status === 201) {
                    navigate('/login');
                }
                res.json().then((j) => {
                    document.getElementById('error').innerHTML = j['message'];
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div>
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
