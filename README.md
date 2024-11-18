# E-SHOP (PRO)

Team 2's ecommerce site for CSC 307

## Init

-   Frontend: `cd frontend && npm install`
-   Database: `mkdir C:\data\db`
-   Backend: `cd backend && npm install`
-   DotEnv: `cd backend`
    ```env
        # backend/.env
        DATABASE_URL="mongodb+srv://ecommerceapp:SNlCVgBoPEldIdXm@ecommercepro.vjker.mongodb.net/?retryWrites=true&w=majority&appName=EcommercePro"
        JWT_KEY="MIIJQwIBADANBgkqhkiG9w0BAQEFAASCCS0wggkpAgEAAoICAQC8dBs72P9i5XyWAL+TKJr7xyT8VbgBectQVnIWT6MJ45tQ36fd ..."
    ```

## Running dev

-   Frontend: `cd frontend && npm run dev`
-   Database: `."C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"`
-   Backend: `cd backend && npm run dev`

## Contributing

-   Use ESLint for linting (`npx eslint . --fix`) and Prettier for formatting (`npm run format`).
-   Semicolons; Singles quotes > double quotes; 4 spaces per tab; trailing commas
-   Ensure that your code passes all ESLint checks before submitting a pull request.
-   To set up your development environment, please install the ESLint and Prettier extensions in your IDE.

### Setting Up Your IDE

#### Optional if you don't want to type `npx eslint . --fix` and `npm run format` every time.

For VSCode:

1. Install the ESLint and Prettier extensions (and also a spellcheck extension).
2.

Under `File > Preferences> Settings > Open Settings (JSON) icon (in the top right, looks like a document with an arrow)`,
paste the following in the file:

```json
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

3. Follow instructions on Prettier extension install page to add to `Open Settings (JSON)`. Here was what I needed to
   do:
    ```json
    {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "[javascript]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
        }
    }
    ```

#### Option 2: Git pre-commit hook

In the .git/ directory navigate to ./git/hooks and create a new file titled `pre-commit`, with the following contents.

```sh
#!/bin/sh

set -eo pipefail

cd backend

npm run lint

npm run format

cd ../frontend

npm run lint

npm run format
```

Committing will now run lint and format on both frontend and backend.
