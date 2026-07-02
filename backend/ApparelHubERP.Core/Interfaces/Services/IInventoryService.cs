using ApparelHubERP.Core.DTOs.Inventory;
using ApparelHubERP.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApparelHubERP.Core.Interfaces.Services;

public interface IInventoryService
{
    Task<List<ProductDto>> GetAllProductsAsync();

    Task<ProductDto> AddProductAsync(CreateProductDto productDto);
   
    Task<ProductDto?> UpdateProductAsync(int id, CreateProductDto productDto);
    Task<bool> DeleteProductAsync(int id);
    Task<List<ProductDto>> GetLowStockProductsAsync();
}