using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApparelHubERP.Core.Interfaces // 👈 Updated to match your exact project core layer
{
    public interface IPOSService
    {
        Task<IEnumerable<POSResponseDto>> GetAllSalesAsync();
        Task<POSResponseDto> GetSaleByIdAsync(int id);
        Task<POSResponseDto> CreateSaleAsync(CreatePOSDto dto);
        Task<POSResponseDto> UpdateSaleAsync(int id, UpdatePOSDto dto);
        Task<bool> DeleteSaleAsync(int id);
    }

    public class POSResponseDto
    {
        public int Id { get; set; }
        public string TransactionNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class CreatePOSDto
    {
        public string TransactionNumber { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class UpdatePOSDto
    {
        public decimal TotalAmount { get; set; }
    }
}