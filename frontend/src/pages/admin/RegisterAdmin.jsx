function Register() {
    // Kicks you if you're not logged in and only shows you the menus you have access to

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
                res.json().then((j) => {
                    document.getElementById('error').innerHTML = j['message']
                        ? j['message']
                        : j;
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            submit_register();
        }
    }

    return (
        <div>
            <div id={'register_fields'}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
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
                <br />
                <label htmlFor="confirm">Confirm Password:</label>
                <input
                    type="password"
                    id="confirm"
                    name="confirm"
                    onKeyPress={handleKeyPress}
                />
                <p id={'error'}></p>
                <input type="submit" onClick={submit_register} value="Submit" />
            </div>
        </div>
    );
}

export default Register;
