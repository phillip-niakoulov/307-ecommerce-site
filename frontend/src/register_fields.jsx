const api = ' http://localhost:5000';

function RegisterFields() {
    async function submit_register() {
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        await fetch(api + '/api/users/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                res.json().then((j) => {
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
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" /> <br />
            <label htmlFor="password">Password:</label>
            <input type="text" id="password" name="password" />
            <p id={'error'}></p>
            <input type="submit" onClick={submit_register} value="Submit" />
        </div>
    );
}

export default RegisterFields;
