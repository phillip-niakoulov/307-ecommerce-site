function Login() {
    async function submit_login() {
        const username = document.getElementById('user').value;
        const password = document.getElementById('password').value;

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
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
                console.log(err);
            });
    }

    return (
        <div id={'login_fields'}>
            <label htmlFor="user">Username:</label>
            <input type="text" id="user" name="user" /> <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
            <p id={'error'}></p>
            <input type="submit" onClick={submit_login} value="Submit" />
        </div>
    );
}

export default Login;
