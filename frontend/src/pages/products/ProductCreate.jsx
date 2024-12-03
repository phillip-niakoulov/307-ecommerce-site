import '../../styles/pages/ProductCreate.css';

function ProductCreate() {
    function create() {
        const request = new FormData();

        request.append('name', document.getElementById('name').value);
        request.append('originalPrice', document.getElementById('price').value);
        request.append(
            'description',
            document.getElementById('description').value
        );
        request.append('category', document.getElementById('category').value);

        const files = document.getElementById('images').files;
        for (let i = 0; i < files.length; i++) {
            request.append('images', files[i]);
        }

        if (isNaN(parseFloat(request.get('originalPrice')))) {
            document.getElementById('err').innerHTML = 'Invalid price';
            return;
        }

        fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/products/create`, {
            method: 'POST',
            body: request,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(async (res) => {
            if (res.status === 201) {
                window.location.replace('/');
                return;
            }
            res.json().then((j) => {
                document.getElementById('err').innerHTML = j['message'];
            });
        });
    }

    return (
        <div id="product_fields">
            <h2>Create New Product</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="price">Price:</label>
                <input type="text" id="price" name="price" required />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    required
                ></textarea>

                <label htmlFor="category">Category:</label>
                <input type="text" id="category" name="category" required />

                <label htmlFor="images">Images:</label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/gif,image/png,image/jpeg"
                    multiple
                />

                <input type="submit" onClick={create} value="Submit" />
                <div id="err"></div>
            </form>
        </div>
    );
}

export default ProductCreate;
