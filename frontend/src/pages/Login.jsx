const api = 'http://localhost:5000';


function Login() {
    async function submit_login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        await fetch(api + '/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                res.json().then((j) => {
                    if (res.status === 200) {
                        localStorage.setItem('token', j['token']);
                        window.location.replace('index.html');
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
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" /> <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
            <p id={'error'}></p>
            <input type="submit" onClick={submit_login} value="Submit" />
        </div>
    );
}

export default Login;
