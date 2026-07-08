import React, { useState, useRef } from "react";
import BarcodeItemSelector from "./BarcodeItemSelector";
import InvoicePreview from "./InvoicePreview";
import "./POSCheckout.css";

export default function PosDashboard() {
  const [cart, setCart] = useState([]);
  const [showPrint, setShowPrint] = useState(false);
  const printRef = useRef();

  const handleAddItem = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);

      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * 0.08;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handlePrint = () => {
    setShowPrint(true);

    setTimeout(() => {
      window.print();
      setShowPrint(false);
    }, 100);
  };

  return (
    <div className="pos-page">
      <div className="pos-topbar">
        <div>
          <h1>Fast POS Billing</h1>
          <p>Scan, select, bill and print customer invoices</p>
        </div>

        <div className="pos-badge">
          <span>POS</span>
          <strong>Retail Checkout</strong>
        </div>
      </div>

      <div className="pos-billing-grid">
        <div className="pos-left-section">
          <div className="pos-header-box">
            <h2>Product Selector</h2>
            <p>
              Scan barcode or choose clothing items from the product catalogue.
            </p>
          </div>

          <BarcodeItemSelector onAddItem={handleAddItem} />
        </div>

        <div className="checkout-panel">
          <div>
            <div className="checkout-header">
              <div>
                <h2>Current Basket</h2>
                <p>{cart.length} item type(s) selected</p>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart-box">
                <div className="empty-icon">🛒</div>
                <h3>Basket is Empty</h3>
                <p>Add products to start billing.</p>
              </div>
            ) : (
              <div className="cart-scroll-container">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>LKR {item.price.toFixed(2)} each</p>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="cart-qty-btn"
                      >
                        -
                      </button>

                      <span className="cart-qty">{item.quantity}</span>

                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="cart-qty-btn"
                      >
                        +
                      </button>

                      <strong>
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="price-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>LKR {calculateSubtotal().toFixed(2)}</strong>
            </div>

            <div className="summary-line">
              <span>Tax Valuation (8%)</span>
              <strong>LKR {calculateTax().toFixed(2)}</strong>
            </div>

            <div className="summary-total">
              <span>Total Amount</span>
              <strong>LKR {calculateTotal().toFixed(2)}</strong>
            </div>

            <button
              onClick={handlePrint}
              disabled={cart.length === 0}
              className="btn-primary-pos"
            >
              Proceed & Print Invoice
            </button>
          </div>
        </div>
      </div>

      {showPrint && (
        <div className="print-wrapper">
          <InvoicePreview
            cart={cart}
            subtotal={calculateSubtotal()}
            tax={calculateTax()}
            total={calculateTotal()}
          />
        </div>
      )}
    </div>
  );
}