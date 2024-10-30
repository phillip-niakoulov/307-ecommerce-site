import ReactDOMClient from 'react-dom/client';
import RegisterFields from './register_fields.jsx';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(<RegisterFields />);
