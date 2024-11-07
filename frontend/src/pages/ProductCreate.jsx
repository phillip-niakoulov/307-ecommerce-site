
import ReactDOMClient from 'react-dom/client';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);
root.render(<ProductCreation />);


function ProductCreation(){
    function create() {
        const request = {
            name: document.getElementById('name').value,
            originalPrice: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById("category").value,
            tags: document.getElementById("tags").value.split(","),
            images: document.getElementById("images").value,
            options: document.getElementById("options").value.split(","),
        }
        console.log(request);
    }

    return (
        <div id={"data"}>
            <label htmlFor={"name"}>Name:</label>
            <input type="text" id="name" name="name" /> <br/>
            <label htmlFor={"price"}>Price: </label>
            <input type="text" id="price" name="price" /> <br/>
            <label htmlFor={"description"}>Description:</label>
            <input type="text" id="description" name="description" /> <br/>
            <label htmlFor={"category"}>Category:</label>
            <input type="text" id="category" name="category" /> <br/>
            <label htmlFor={"tags"}>Tags:</label>
            <input type="text" id="tags" name="tags" /> <br/>
            <label htmlFor={"images"}>Image:</label>
            <input type="file" id="images" name="images" /> <br/>
            <label htmlFor={"options"}>Options:</label>
            <input type="text" id="options" name="options" /> <br/>

            <input type={"submit"} onClick={create} value="Submit" />


        </div>
    );
}

export default ProductCreation