import { api } from '../common/common';

function Register() {
    async function submit_register() {
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;

        if (confirm !== password) {
            document.getElementById('error').innerHTML =
                'Passwords do not match';
            return;
        }

        await fetch(api + '/api/users/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.status === 201) {
                    window.location.replace('index.html');
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
        <div id={'register_fields'}>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" /> <br />
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" /> <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" /> <br />
            <label htmlFor="confirm">Confirm Password:</label>
            <input type="password" id="confirm" name="confirm" />
            <p id={'error'}></p>
            <input type="submit" onClick={submit_register} value="Submit" />
        </div>
    );
}

export default Register;
