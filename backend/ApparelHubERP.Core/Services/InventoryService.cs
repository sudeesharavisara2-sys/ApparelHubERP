using ApparelHubERP.Core.DTOs.Inventory;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace ApparelHubERP.Core.Services;

public class InventoryService : IInventoryService
{
    private readonly DbContext _context;

    public InventoryService(DbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductDto>> GetAllProductsAsync()
    {
        var products = await _context.Set<Product>().ToListAsync();

        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Category = p.Category,
            Size = p.Size,
            Color = p.Color,
            Quantity = p.Quantity,
            Price = p.Price
        }).ToList();
    }

    public async Task<ProductDto> AddProductAsync(CreateProductDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Category = productDto.Category,
            Size = productDto.Size,
            Color = productDto.Color,
            Quantity = productDto.Quantity,
            Price = productDto.Price
        };

        _context.Set<Product>().Add(product);
        await _context.SaveChangesAsync();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Size = product.Size,
            Color = product.Color,
            Quantity = product.Quantity,
            Price = product.Price
        };
       
   
    }
    public async Task<ProductDto?> UpdateProductAsync(int id, CreateProductDto productDto)
    {
        var product = await _context.Set<Product>()
            .FindAsync(id);

        if (product == null)
            return null;

        product.Name = productDto.Name;
        product.Category = productDto.Category;
        product.Size = productDto.Size;
        product.Color = productDto.Color;
        product.Quantity = productDto.Quantity;
        product.Price = productDto.Price;

        await _context.SaveChangesAsync();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            Size = product.Size,
            Color = product.Color,
            Quantity = product.Quantity,
            Price = product.Price
        };
    }
    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Set<Product>()
            .FindAsync(id);

        if (product == null)
            return false;

        _context.Set<Product>().Remove(product);

        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<List<ProductDto>> GetLowStockProductsAsync()
    {
        var products = await _context.Set<Product>()
            .Where(p => p.Quantity < 10)
            .ToListAsync();

        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Category = p.Category,
            Size = p.Size,
            Color = p.Color,
            Quantity = p.Quantity,
            Price = p.Price
        }).ToList();
    }
  
}