using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using ApparelHubERP.Core.Interfaces; 

namespace ApparelHubERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class POSController : ControllerBase
    {
        private readonly IPOSService _posService;

        public POSController(IPOSService posService)
        {
            _posService = posService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSales()
        {
            var sales = await _posService.GetAllSalesAsync();
            return Ok(sales);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSaleById(int id)
        {
            var sale = await _posService.GetSaleByIdAsync(id);
            if (sale == null) return NotFound();
            return Ok(sale);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSale([FromBody] CreatePOSDto dto)
        {
            var result = await _posService.CreateSaleAsync(dto);
            return CreatedAtAction(nameof(GetSaleById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSale(int id, [FromBody] UpdatePOSDto dto)
        {
            var updatedSale = await _posService.UpdateSaleAsync(id, dto);
            if (updatedSale == null) return NotFound();
            return Ok(updatedSale);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var successful = await _posService.DeleteSaleAsync(id);
            if (!successful) return NotFound();
            return NoContent();
        }
    }
}