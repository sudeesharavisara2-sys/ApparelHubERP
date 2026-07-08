import axios from 'axios';

// Backend base URL pointing to the active port 5024 from your Swagger UI
const API_BASE_URL = 'http://localhost:5024/api';

export const posService = {
    /**
     * Step 1: Fetch all available products from the inventory database catalog
     */
    getInventoryProducts: async () => {
        try {
            // Adjust the endpoint string (e.g., '/Products' or '/Inventory') to match your backend Controller
            const response = await axios.get(`${API_BASE_URL}/Products`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch warehouse product streams.");
        }
    },

    /**
     * Step 2: Save the generated sales order invoice metadata to the DB
     */
    saveInvoice: async (invoicePayload) => {
        try {
            // Adjust endpoint if your sales manager routing uses a different name (e.g., '/Invoices' or '/Sales')
            const response = await axios.post(`${API_BASE_URL}/Invoices`, invoicePayload);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to commit financial checkout record.");
        }
    },

    /**
     * Step 3: Deduct the purchased amounts from the item stock quantities
     */
    reduceProductStock: async (productId, currentStock, qtyToDeduct) => {
        try {
            const updatedQty = currentStock - qtyToDeduct;
            
            // Sends a updates request to your inventory database tables matching your controllers
            const response = await axios.put(`${API_BASE_URL}/Products/${productId}/UpdateStock`, {
                quantity: updatedQty
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || `Failed to update stock quantities for Item ID: ${productId}`);
        }
    }
};