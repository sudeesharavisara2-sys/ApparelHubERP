using ApparelHubERP.Core.DTOs.Procurement;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface IVarianceService
    {
        Task<CostVarianceDto> GetVarianceByOrderIdAsync(int orderId);
        Task<IEnumerable<CostVarianceDto>> GetAllVariancesAsync();
        Task<ProcurementDashboardDto> GetDashboardStatsAsync();
    }
}