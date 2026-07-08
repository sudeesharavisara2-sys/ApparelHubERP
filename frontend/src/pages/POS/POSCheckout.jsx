import React, { useState, useEffect } from 'react';
import { posService } from '../../services/posService';
import './POSCheckout.css';

const POSCheckout = () => {
    // Inventory and Cart tracking lists
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    
    // Controlled field inputs
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    // Invoice Print Preview state variables
    const [completedInvoice, setCompletedInvoice] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    // Load inventory from database on mount
    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const data = await posService.getInventoryProducts();
            setProducts(data);
        } catch (error) {
            alert("Error loading inventory items: " + error.message);
        }
    };

    // Push selected item to the bill checkout cart
    const handleAddToCart = () => {
        if (!selectedProductId) return;
        
        const targetProduct = products.find(p => p.id === parseInt(selectedProductId));
        if (!targetProduct) return;

        if (quantity > targetProduct.quantity) {
            alert(`Insufficient stock! Only ${targetProduct.quantity} items remaining.`);
            return;
        }

        const existingItemIndex = cart.findIndex(item => item.id === targetProduct.id);
        if (existingItemIndex > -1) {
            alert("Item already added to cart. Adjust quantities or re-add.");
            return;
        }

        const cartItem = {
            id: targetProduct.id,
            name: targetProduct.name,
            price: targetProduct.price,
            selectedQty: parseInt(quantity),
            maxAvailableQty: targetProduct.quantity,
            subtotal: targetProduct.price * parseInt(quantity)
        };

        setCart([...cart, cartItem]);
        setSelectedProductId('');
        setQuantity(1);
    };

    // Calculate billing values dynamically
    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + item.subtotal, 0);
    };

    // Fire Service Updates on Checkout Confirmation
    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Your checkout cart is completely empty.");
            return;
        }

        setLoading(true);
        const generatedTrx = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;
        const currentCartSnapshot = [...cart];
        const totalBillAmount = calculateTotal();

        try {
            // 1. Log Invoice Record into Sales backend
            const invoicePayload = {
                transactionNumber: generatedTrx,
                totalAmount: totalBillAmount
            };
            await posService.saveInvoice(invoicePayload);

            // 2. Adjust database quantities concurrently
            for (const item of currentCartSnapshot) {
                await posService.reduceProductStock(item.id, item.maxAvailableQty, item.selectedQty);
            }

            // 3. Populate Invoice Print Preview snapshot payload
            setCompletedInvoice({
                transactionNumber: generatedTrx,
                date: new Date().toLocaleString(),
                items: currentCartSnapshot,
                total: totalBillAmount
            });
            setShowInvoiceModal(true);

            setCart([]); // Reset local cart
            fetchInventory(); // Pull down refreshed quantities
        } catch (error) {
            alert("Checkout processing error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <div className="pos-container">
            {/* Main Interactive Screen Segment */}
            <div className="pos-left-panel">
                <div className="pos-card">
                    <h2 className="pos-title">Point of Sale System (POS)</h2>
                    
                    <div className="selector-group">
                        <select 
                            className="pos-select"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">-- Select Product via Barcode Tracker --</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} ({product.color} - {product.size}) - LKR {product.price} [Qty: {product.quantity}]
                                </option>
                            ))}
                        </select>

                        <input 
                            type="number" 
                            className="pos-input" 
                            min="1" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />

                        <button className="pos-btn-add" onClick={handleAddToCart}>
                            Add to Bill
                        </button>
                    </div>
                </div>

                <div className="pos-card" style={{ flex: 1 }}>
                    <h3 style={{ color: '#1d3557', marginTop: 0 }}>Current Invoice Items</h3>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>LKR {item.price}</td>
                                    <td>{item.selectedQty}</td>
                                    <td>LKR {item.subtotal}</td>
                                </tr>
                            ))}
                            {cart.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#6c757d', padding: '30px' }}>
                                        No items staged on current order ledger.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sidebar Right Column Section */}
            <div className="pos-right-panel">
                <h3 style={{ color: '#1d3557', marginTop: 0, marginBottom: '20px' }}>Order Billing Summary</h3>
                
                <div className="billing-row">
                    <span>Subtotal</span>
                    <span>LKR {calculateTotal()}</span>
                </div>
                <div className="billing-row">
                    <span>Tax (0%)</span>
                    <span>LKR 0</span>
                </div>
                
                <div className="billing-row total-row">
                    <span>Total Amount</span>
                    <span>LKR {calculateTotal()}</span>
                </div>

                <button 
                    className="pos-btn-checkout" 
                    onClick={handleCheckout}
                    disabled={loading}
                >
                    {loading ? "Processing Order..." : "Confirm Checkout & Print Invoice"}
                </button>
            </div>

            {/* Modal Overlay Layer for: Invoice Print Preview */}
            {showInvoiceModal && completedInvoice && (
                <div className="invoice-modal-overlay">
                    <div className="invoice-modal-box">
                        <div className="printable-receipt-area">
                            <div className="receipt-header">
                                <h2>APPARELHUB ERP</h2>
                                <p>Retail Management System Receipt</p>
                                <hr />
                            </div>
                            <div className="receipt-meta">
                                <p><strong>Trx Id:</strong> {completedInvoice.transactionNumber}</p>
                                <p><strong>Date:</strong> {completedInvoice.date}</p>
                            </div>
                            <table className="receipt-table">
                                <thead>
                                    <tr>
                                        <th>Item Description</th>
                                        <th>Qty</th>
                                        <th style={{ textAlign: 'right' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedInvoice.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.selectedQty}</td>
                                            <td style={{ textAlign: 'right' }}>LKR {item.subtotal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <hr />
                            <div className="receipt-total-block">
                                <h3>Total Paid: LKR {completedInvoice.total}</h3>
                            </div>
                        </div>
                        <div className="modal-actions-row">
                            <button className="btn-print-action" onClick={handlePrintInvoice}>
                                Print Receipt
                            </button>
                            <button className="btn-close-action" onClick={() => setShowInvoiceModal(false)}>
                                New Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POSCheckout;