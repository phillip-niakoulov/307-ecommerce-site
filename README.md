AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=csc307images;AccountKey=e4EWfNQbc+pIsQEXsIFNRsEkH0qgMPVkTl/ZR7vhroWp+VmFH50kNyyLFcjuNvkxB30CgZrR9Uqu+AStDmSGew==;EndpointSuffix=core.windows.net

# E-SHOP (PRO)

Welcome to E-SHOP (PRO), an e-commerce platform designed with a strong emphasis on user security and administrative functionality. We are utilizing the MERN stack along with Azure for Continuous Integration (CI), Continuous Deployment (CD), and Content Delivery Network (CDN) services.

## Getting Started

### Initialization

1. **Frontend Setup**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `/frontend` directory with the following variables:
     ```
     VITE_API_BACKEND_PORT
     VITE_API_BACKEND_URL
     ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `/backend` directory with the following variables:
     ```
     DATABASE_URL
     JWT_KEY
     AZURE_STORAGE_CONNECTION_STRING
     ```

### Running the Development Environment

- **Frontend**: 
  ```bash
  cd frontend && npm run dev
  ```
- **Backend**: 
  ```bash
  cd backend && npm run dev
  ```
- **Database (if running locally)**: 
  ```bash
  "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
  ```

## Contributing

To maintain code quality, please adhere to the following guidelines:

- Use **ESLint** for linting:
  ```bash
  npx eslint . --fix
  ```
- Use **Prettier** for formatting:
  ```bash
  npm run format
  ```
- Code Style Guidelines:
  - Use semicolons.
  - Prefer single quotes over double quotes.
  - Use 4 spaces per tab.
  - Include trailing commas where applicable.
- Ensure that your code passes all ESLint checks before submitting a pull request.
- Install the ESLint and Prettier extensions in your IDE for a smoother development experience.

### Setting Up Your IDE

#### Optional: Automate Formatting and Linting

For **Visual Studio Code** users:

1. Install the **ESLint** and **Prettier** extensions (consider adding a spellcheck extension as well).
2. Open your settings in JSON format:
   - Navigate to `File > Preferences > Settings`, then click on the Open Settings (JSON) icon in the top right.
3. Add the following configuration to enable automatic formatting and linting on save:
   ```json
   {
       "editor.formatOnSave": true,
       "editor.codeActionsOnSave": {
           "source.fixAll.eslint": true
       }
   }
   ```
4. Follow the instructions on the Prettier extension installation page to add the following to your settings:
   ```json
   {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "[javascript]": {
           "editor.defaultFormatter": "esbenp.prettier-vscode"
       }
   }
   ```

> **Note:**  
> Make sure to run `npm run cleanup` in the root directory before committing your changes.

## [UML Diagrams](DIAGRAMS.md)

For more info about the architecture and design, please refer to the UML diagrams provided in the linked document.
