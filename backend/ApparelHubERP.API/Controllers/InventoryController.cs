using ApparelHubERP.Core.DTOs.Inventory;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApparelHubERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("Inventory API is working!");
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _inventoryService.GetProductByIdAsync(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _inventoryService.GetAllProductsAsync();
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> AddProduct(CreateProductDto productDto)
    {
        var product = await _inventoryService.AddProductAsync(productDto);
        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(
        [FromRoute] int id,
        [FromBody] CreateProductDto productDto)
    {
        var updatedProduct =
            await _inventoryService.UpdateProductAsync(id, productDto);

        if (updatedProduct == null)
            return NotFound();

        return Ok(updatedProduct);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _inventoryService.DeleteProductAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Product deleted successfully!");
    }
    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStockProducts()
    {
        var products = await _inventoryService.GetLowStockProductsAsync();
        return Ok(products);
    }
}