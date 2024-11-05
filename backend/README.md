### User Routes

#### 1. Register User

**POST** `/api/users/register`  
Creates a new user.

-   **Input:**

    ```json
    {
        "username": "myusername",
        "email": "my@email.com",
        "password": "mypassword"
    }
    ```

-   **Output:** - **201**: When successful
    `
{
"message": "User registered successfully",
"userId": "67189d94ff2e38b3a36bdf14"
}` - **409**: When username or email is already in use
    `
{
"message": "Username or email is already in use"
}`

---

#### 2. Login User

**POST** `/api/users/login`  
Login with email and password.

-   **Input:**

    ```json
    {
        "email": "my@email.com",
        "password": "mypassword"
    }
    ```

-   **Output:** - **201**: When successful
    `
{
"message": "Login successful",
"userId": "6718a28ed34dfcec43ac1ee7"
}` - **403**: When email or password is invalid
    `
{
"message": "Invalid email or password"
}`

---

#### 3. Get User Information

**GET** `/api/users/:id`  
Gets information about the provided user ID.

-   **Output:** - **200**: When successful
    `
{
"_id": "67189d94ff2e38b3a36bdf14",
"username": "myusername",
"email": "my@email.com",
"role": "user",
"createdAt": "2024-10-23T06:54:12.524Z",
"__v": 0
}` - **400**: When the ID format is invalid
    `
{
"message": "Invalid ID format"
}` - **404**: When the user is not found
    `
{
"message": "User not found"
}`

---

#### 4. Update User Information

**PUT** `/api/users/:id`  
Update using the provided user ID.

-   **Output:** - **200**: When successful
    `
{
"_id": "67189d94ff2e38b3a36bdf14",
"username": "myusername",
"email": "my@email.com",
"role": "user",
"createdAt": "2024-10-23T06:54:12.524Z",
"__v": 0
}` - **400**: When the ID format is invalid
    `
{
"message": "Invalid ID format"
}` - **404**: When the user is not found
    `
{
"message": "User not found"
}`

---

#### 5. Delete User

**DELETE** `/api/users/:id`  
Removes the user based on the provided user ID.

-   **Output:** - **200**: When successful
    `
{
"message": "User deleted"
}` - **400**: When the ID format is invalid
    `
{
"message": "Invalid ID format"
}` - **404**: When the user is not found
    `
{
"message": "User not found"
}`

---

## Product Routes

#### 1. Create Product

**POST** `/api/products/create`  
Create a new product.

-   **Input:**  
    Instead of json, pass through form-data with ability to file attach.

    ```json
    {
        "name": "Nike Leather Shoes",
        "originalPrice": 54.99,
        "description": "A pair of Nike shoes.",
        "category": "shoes",
        "tags": ["blue", "nike", "sneaker", "leather", "men", "women"],
        "images": "UPLOAD FILES",
        "options": ["small", "medium", "large"]
    }
    ```

-   **Output:**

    -   **201**: When successful
        ```json
        {
            "_id": "nike-leather-shoes",
            "name": "Nike Leather Shoes",
            "originalPrice": 54.99,
            "description": "A pair of Nike shoes.",
            "imageUrls": ["image-102976394108.png"],
            "category": "shoes",
            "tags": ["blue", "nike", "sneaker", "leather", "men", "women"],
            "createdAt": "2024-10-23T17:01:18.465Z",
            "options": ["small", "medium", "large"],
            "__v": 0
        }
        ```

-   **400**: When no images are uploaded
    `
{
"message": "No images were uploaded"
}`

-   **400**: When a required field is missing
    `
{
"message": "Missing required fields"
}`

-   **409**: When a name is already in use
    `
{
"message": "Name is already in use"
}`

-   **409**: When an ID is already in use (if the lowercase "url" version exists)
    `
{
"message": "Product with this ID already exists"
}`

---

#### 2. Get all products

**GET** `/api/products/`  
Gets information about all products.

-   **Output:**
    -   **200**: When successful
        ```json
        [
            {
                "_id": "nike-leather-shoes",
                "name": "Nike Leather Shoes",
                "originalPrice": 54.99,
                "description": "A pair of Nike shoes.",
                "imageUrls": ["image-102976394108.png"],
                "category": "shoes",
                "tags": ["blue", "nike", "sneaker", "leather", "men", "women"],
                "createdAt": "2024-10-23T17:01:18.465Z",
                "__v": 0
            },
            {
                "_id": "dr.-martens-boots",
                "name": "Dr. Martens Boots",
                "originalPrice": 89.99,
                "description": "A pair of Dr. Martens boots.",
                "imageUrls": ["image-123657289108.png"],
                "category": "shoes",
                "tags": ["brown", "dr-martens", "boots", "leather", "women"],
                "createdAt": "2024-10-23T17:04:27.930Z",
                "__v": 0
            }
        ]
        ```

---

#### 3. Get a product's information

**GET** `/api/products/:id`  
Gets information about the provided user ID.

-   **Output:**

    -   **200**: When successful
        ```json
        {
            "_id": "nike-leather-shoes",
            "name": "Nike Leather Shoes",
            "originalPrice": 54.99,
            "description": "A pair of Nike shoes.",
            "imageUrls": ["image-102976394108.png"],
            "category": "shoes",
            "tags": ["blue", "nike", "sneaker", "leather", "men", "women"],
            "createdAt": "2024-10-23T17:01:18.465Z",
            "__v": 0
        }
        ```

-   **404**: When the ID format is invalid or the item is not found
    `
{
"message": "Product not found"
}`

---

#### 4. Update a product's information

**PUT** `/api/users/:id`  
Update using the provided product ID.

-   **Input:**  
    Instead of json, pass through form-data with ability to file attach.

    ```json
    {
        "name": "Orange Nike Shoes",
        "originalPrice": 49.99,
        "description": "A pair of Orange Nike shoes.",
        "category": "shoes",
        "tags": ["orange", "nike", "sneaker", "men", "women"],
        "images": "UPLOAD FILES"
    }
    ```

-   **Output:**

    -   **200**: When successful
        ```json
        {
            "_id": "orange-nike-shoes",
            "name": "Orange Nike Shoes",
            "originalPrice": 49.99,
            "description": "A pair of Orange Nike shoes.",
            "imageUrls": ["image-102976394127.png"],
            "category": "shoes",
            "tags": ["orange", "nike", "sneaker", "men", "women"],
            "createdAt": "2024-10-23T17:12:06.706Z",
            "__v": 0
        }
        ```

-   **400**: When no images are uploaded
    `
{
"message": "No images were uploaded"
}`
-   **400**: When a required field is missing
    `
{
"message": "Missing required fields"
}`

-   **404**: When the provided ID can't be found
    `
{
"message": "Product not found"
}`

-   **409**: When a name is already in use
    `
{
"message": "Name is already in use"
}`

-   **409**: When an ID is already in use (if the lowercase "url" version exists)
    `
{
"message": "Product with this ID already exists"
}`

---

#### 5. Delete a product

**DELETE** `/api/products/:id`  
Removes the product based on the provided product ID. Also, remove associated files in "/uploads".

-   **Output:** - **200**: When successful
    `
{
"message": "Product deleted"
}` - **404**: When the product is not found
    `
{
"message": "Product not found"
}`

---

### Cart Routes

#### 1. Create a Shopping Cart

**POST** `/api/carts/create`
In the body include:
`{owner: id}`

-   **Output:**

    -   **201:** When successful

    ```json
    {
        "_id": "67208f629ef1419678913f85",
        "products": [],
        "createdAt": "2024-10-29T07:31:46.654Z",
        "owner": "672046325e9415000ccd8e85",
        "__v": 0
    }
    ```

    -   **200:** Already exists

    -   **400:** Owner is missing or is not in a valid format
    -   **404:** Owner does not exist

---

#### 2. Adding items to a Shopping Cart

**PUT** `/api/carts/:id`
**Body:**
`{"product": product_id }`

-   **Output**
    -   **201:** Added
    -   **200:** Product already in cart
    -   **404:** Cannot find product or cart
    -   **400:** Product/cart not specified or in invalid format

---

#### 3. Removing items to a Shopping Cart

**DELETE** `/api/carts/:id`
**Body:**
`{"product": product_id }`

-   **Output**
    -   **200:** Deleted
    -   **404:** Cannot find product or cart
    -   **400:** Product/cart not specified or in invalid format

### **NOTE: Not including a body will remove the entire cart**

---

### 4. Get the contents of a Shopping Cart

**GET** `/api/carts/:id`

-   **Output**
    -   **200:** Successful Retrieval
    -   **400:** Invalid Id Format
    -   **404:** Cart not found
