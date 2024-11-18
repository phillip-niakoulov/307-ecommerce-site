import '../styles/pages/notfound.css';

function NotFound() {
    return (
        <div className="notfound-container">
            <h1>404</h1>
            <p>We Couldn't Find What You're Looking For</p>
            <a href="/" className="home-link">Go to Home</a>
        </div>
    );
}

export default NotFound;
