import React, { useState } from "react";

const MOCK_PRODUCTS = [
  { id: "1", barcode: "11111", name: "Classic Men's Slim Fit Shirt", price: 3200 },
  { id: "2", barcode: "22222", name: "Premium Denim Jeans", price: 5400 },
  { id: "3", barcode: "33333", name: "Oversized Cotton Hoodie", price: 4800 },
  { id: "4", barcode: "44444", name: "Casual Summer Linen Dress", price: 3900 },
  { id: "5", barcode: "55555", name: "Chino Work Trousers", price: 4200 },
];

export default function BarcodeItemSelector({ onAddItem }) {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const product = MOCK_PRODUCTS.find((p) => p.barcode === barcodeInput);
    if (product) {
      onAddItem(product);
      setBarcodeInput("");
    }
  };

  const filteredProducts = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Scanner & Input Bar */}
      <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleBarcodeSubmit} style={{ flex: 2, minWidth: '250px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#475569' }}>Simulate Barcode Scan (Press Enter)</label>
          <input
            type="text"
            placeholder="Scan barcode (e.g., 11111, 22222)..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="pos-input-field"
            autoFocus
          />
        </form>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#475569' }}>Search Text Filter</label>
          <input
            type="text"
            placeholder="Search clothing items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pos-input-field"
          />
        </div>
      </div>

      {/* Grid Layout Matrix */}
      <div className="product-matrix-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} onClick={() => onAddItem(product)} className="product-card">
            <div>
              <span className="product-barcode-badge">{product.barcode}</span>
              <h3 className="product-title">{product.name}</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <span className="product-price-tag">LKR {product.price.toFixed(2)}</span>
              <span className="product-add-action">Add +</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}