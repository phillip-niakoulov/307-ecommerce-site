import ReactDOMClient from 'react-dom/client';
import LoginFields from './login_fields.jsx';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(<LoginFields />);
