import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getProductById,
    updateProduct,
} from "../../services/inventoryService";
import "./InventoryDashboard.css";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        category: "",
        size: "",
        color: "",
        quantity: "",
        price: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            const response = await getProductById(id);
            setProduct(response.data);
        } catch (error) {
            console.error("Failed to load product", error);
            alert("Failed to load product.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateProduct(id, product);
            alert("Product updated successfully!");
            navigate("/inventory");
        } catch (error) {
            console.error(error);
            alert("Failed to update product.");
        }
    };

    if (loading) {
        return <h2 style={{ padding: "30px" }}>Loading...</h2>;
    }

    return (
        <div className="inventory-dashboard">

            <div className="dashboard-header">
                <h1>Edit Product</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    marginTop: "20px",
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
                    Update Product
                </button>

            </form>

        </div>
    );
}

export default EditProduct;