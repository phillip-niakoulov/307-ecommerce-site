import { useState, useEffect } from "react";
import '../styles/pages/home.css';

function Home() {
    const [items, setItems] = useState([]);

    function fetchUsers() {
        const promise = fetch("Http://localhost:8000/api/products");
        return promise
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then(function(json){
                setItems(json)
            })
            .catch((error) => { console.log(error); });
    }, [] );
    
    // function postItem(item) {
    //     const promise = fetch("Http://localhost:800/api/products", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(item),
    //     });
    //     return promise
    // }

    // function updateList(item) {
    //     postItem(item)
    //         .then(function(response){
    //             if(response.status === 201)
    //                 return response.json();
    //         })
    //         .then(function(item) {
    //             setItems([...items, item])
    //         })
    //         .catch((error) => { console.log(error); });
    // }

    return (
        <div>
            <h1>Product List</h1>
            {items.map((item) => (
                <div key={item.id}><a href={`/product/${item._id}`}>{item.name}</a></div>
            ))}
        </div>
    );

}

export default Home;
