import React from "react";

export default function InvoicePreview({ cart, subtotal, tax, total }) {
  const invoiceNumber = Math.floor(100000 + Math.random() * 900000);
  const currentDate = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

  return (
    <div style={{ padding: '20px', maxWidth: '58mm', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'monospace', fontSize: '11px' }}>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px 0' }}>APPARELHUB ERP</h2>
        <p style={{ margin: '2px 0' }}>Colombo Road, Sri Lanka</p>
        <p style={{ margin: '2px 0' }}>Tel: +94 11 234 5678</p>
      </div>

      <div style={{ borderBottom: '1px dashed #000000', paddingBottom: '8px', marginBottom: '10px' }}>
        <p style={{ margin: '2px 0' }}><strong>Invoice:</strong> #{invoiceNumber}</p>
        <p style={{ margin: '2px 0' }}><strong>Date:</strong> {currentDate}</p>
        <p style={{ margin: '2px 0' }}><strong>Cashier:</strong> POS-06</p>
      </div>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '1px dashed #000000' }}>
            <th style={{ paddingBottom: '4px' }}>Item</th>
            <th style={{ textAlign: 'center', paddingBottom: '4px' }}>Qty</th>
            <th style={{ textAlign: 'right', paddingBottom: '4px' }}>LKR</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: '4px 0', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</td>
              <td style={{ textAlign: 'center', padding: '4px 0' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '4px 0' }}>{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #000000', paddingTop: '6px', textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
          <span>Subtotal:</span><span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
          <span>Tax (8%):</span><span>LKR {tax.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '4px', borderTop: '1px dashed #000000', paddingTop: '4px' }}>
          <span>TOTAL:</span><span>LKR {total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '10px', borderTop: '1px dashed #000000' }}>
        <p style={{ margin: '2px 0', fontWeight: 'bold' }}>Thank You For Shopping!</p>
        <p style={{ margin: '2px 0', fontSize: '9px', color: '#666666' }}>System Developed by Member 06</p>
      </div>
    </div>
  );
}