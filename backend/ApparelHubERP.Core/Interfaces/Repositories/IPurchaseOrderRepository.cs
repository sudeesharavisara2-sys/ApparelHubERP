using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.Interfaces.Repositories
{
    public interface IPurchaseOrderRepository
    {
        Task<IEnumerable<PurchaseOrder>> GetAllAsync();
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<PurchaseOrder?> GetOrderWithItemsAndSupplierAsync(int id);
        Task<IEnumerable<PurchaseOrder>> GetOrdersBySupplierAsync(int supplierId);
        Task AddAsync(PurchaseOrder order);
        void Update(PurchaseOrder order);
        Task<string> GeneratePONumberAsync();
        Task SaveChangesAsync();
    }
}