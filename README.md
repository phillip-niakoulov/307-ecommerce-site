# E-SHOP (PRO)

Team 2's ecommerce site for CSC 307

## Init

- Frontend: `cd frontend && npm install`
- Backend: `cd backend && npm install`

## Running dev

- Frontend: `cd frontend && npm start`
- Backend: `cd backend && npm run dev`

## Contributing

- Use ESLint for linting (`npx eslint . --fix`) and Prettier for formatting (`npm run format`).
- Semicolons; Singles quotes > double quotes; 4 spaces per tab; trailing commas
- Ensure that your code passes all ESLint checks before submitting a pull request.
- To set up your development environment, please install the ESLint and Prettier extensions in your IDE.

### Setting Up Your IDE

#### Optional if you don't want to type `npx eslint . --fix` and `npm run format` every time.

For VSCode:

1. Install the ESLint and Prettier extensions (and also a spellcheck extension).
2. Under `File > Preferences> Settings > Open Settings (JSON) icon (in the top right, looks like a document with an arrow)`, paste the following in the file:
   ```json
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
   ```
3. Follow instructions on Prettier extension install page to add to `Open Settings (JSON)`. Here was what I needed to do:
   ```json
   "editor.defaultFormatter": "esbenp.prettier-vscode",
   "[javascript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```
