import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/inventoryService";
import "./InventoryDashboard.css";

function AddProduct() {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        category: "",
        size: "",
        color: "",
        quantity: "",
        price: ""
    });

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await createProduct(product);

        alert("Product added successfully!");

        navigate("/inventory");
    } catch (error) {
        console.error(error);
        alert("Failed to add product.");
    }
};
    return (
        <div className="inventory-dashboard">

            <div className="dashboard-header">
                <h1>Add Product</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    marginTop: "20px"
                }}
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    className="search-box"
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={product.category}
                    onChange={handleChange}
                    className="search-box"
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="size"
                    placeholder="Size"
                    value={product.size}
                    onChange={handleChange}
                    className="search-box"
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={product.color}
                    onChange={handleChange}
                    className="search-box"
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={handleChange}
                    className="search-box"
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    className="search-box"
                    required
                />

                <br /><br />

                <button type="submit" className="add-btn">
                    Save Product
                </button>

            </form>

        </div>
    );
}

export default AddProduct;