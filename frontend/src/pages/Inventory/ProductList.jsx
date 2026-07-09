import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/inventoryService";

function ProductList() {
    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error("Error loading products", err);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Product List</h2>

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.size}</td>
                            <td>{product.color}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>

                            <td>
                                <button>Edit</button>

                                <button
                                    onClick={() => handleDelete(product.id)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;