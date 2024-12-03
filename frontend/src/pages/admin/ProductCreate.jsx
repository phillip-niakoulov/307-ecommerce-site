function ProductCreate() {
    function create() {
        const request = new FormData(); // Use FormData to handle file uploads

        request.append('name', document.getElementById('name').value);
        request.append('originalPrice', document.getElementById('price').value);
        request.append(
            'description',
            document.getElementById('description').value,
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
                // Don't set 'Content-Type' header when using FormData
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
        <div>
            <h1>Create Product</h1>
            <div id={'data'}>
                <label htmlFor={'name'}>Name:</label>
                <input type="text" id="name" name="name" /> <br />
                <label htmlFor={'price'}>Price: </label>
                <input type="text" id="price" name="price" /> <br />
                <label htmlFor={'description'}>Description:</label>
                <input type="text" id="description" name="description" /> <br />
                <label htmlFor={'category'}>Category:</label>
                <input type="text" id="category" name="category" /> <br />
                <label htmlFor={'images'}>Images:</label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    accept={'image/gif,image/png,image/jpeg'}
                    multiple
                />{' '}
                <br />
                <input type={'submit'} onClick={create} value="Submit" />
                <div id="err"></div>
            </div>
        </div>
    );
}

export default ProductCreate;
