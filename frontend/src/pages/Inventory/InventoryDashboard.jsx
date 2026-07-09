import "./InventoryDashboard.css";
import { useEffect, useState } from "react";
import {
    getProducts,
    deleteProduct
} from "../../services/inventoryService";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../context/AuthContext";
function InventoryDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const navigate = useNavigate();
    const { user } = useAuth();
    const loadProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
        await deleteProduct(id);

        alert("Product deleted successfully!");

        loadProducts();
    } catch (error) {
        console.error(error);
        alert("Failed to delete product.");
    }
};
    const exportToExcel = () => {

    const exportData = products.map(product => ({
    "ID": product.id,
    "Product Name": product.name,
    "Category": product.category,
    "Size": product.size,
    "Color": product.color,
    "Quantity": product.quantity,
    "Price (LKR)": product.price
}));

const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Products"
    );

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Inventory_Products.xlsx");
};

   useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
    }

    loadProducts();
   }, [user, navigate]);
    const filteredProducts = [...products]
    .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        switch (sortOption) {
            case "name-asc":
                return a.name.localeCompare(b.name);

            case "name-desc":
                return b.name.localeCompare(a.name);

            case "price-low":
                return a.price - b.price;

            case "price-high":
                return b.price - a.price;

            case "qty-low":
                return a.quantity - b.quantity;

            case "qty-high":
                return b.quantity - a.quantity;

            default:
                return 0;
        }
    });
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
    );

    const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
    );
    if (!user) {
    return null;
}

    return (
        <div className="inventory-dashboard">

            <div className="dashboard-header">
                <h1>Inventory Dashboard</h1>

                <button
                    className="add-btn"
                    onClick={() => navigate("/inventory/add")}
                >
                    + Add Product
                </button>
                <button
                    className="export-btn"
                    onClick={exportToExcel}
                >
                    📥 Export Excel
                </button>
            </div>
<div className="dashboard-cards">

    <div className="card">
        <div className="card-icon">📦</div>
        <h3>Total Products</h3>
        <p>{products.length}</p>
    </div>

    <div className="card">
        <div className="card-icon">⚠️</div>
        <h3>Low Stock</h3>
        <p>
            {products.filter(product => product.quantity <= 10).length}
        </p>
    </div>

    <div className="card">
        <div className="card-icon">📂</div>
        <h3>Categories</h3>
        <p>
            {new Set(products.map(product => product.category)).size}
        </p>
    </div>

</div>
 

            <div className="table-section">

               <div className="search-sort-container">

    <input
        type="text"
        placeholder="Search by Name or Category..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />

    <select
        className="sort-dropdown"
        value={sortOption}
        onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
        }}
    >
        <option value="">Sort By</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="price-low">Price: Low → High</option>
        <option value="price-high">Price: High → Low</option>
        <option value="qty-low">Quantity: Low → High</option>
        <option value="qty-high">Quantity: High → Low</option>
    </select>

</div>

                <table>

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
                        {loading ? (
                            <tr>
                                <td colSpan="8">Loading...</td>
                            </tr>
                        ) : filteredProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.size}</td>
                                    <td>{product.color}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/inventory/edit/${product.id}`)}
                                        >
                                            ✏ Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            🗑 Delete
                                        </button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                 <td colSpan="8">
                                     {searchTerm
                                         ? "No matching products found"
                                         : "No Products Available"}
                                 </td>
                            </tr>
                        )}
                    </tbody>

                </table>
                <div className="pagination">

    <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
    >
        ◀ Previous
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
        <button
            key={index + 1}
            className={currentPage === index + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(index + 1)}
        >
            {index + 1}
        </button>
    ))}

    <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
    >
        Next ▶
    </button>

</div>

            </div>

        </div>
    );
}

export default InventoryDashboard;