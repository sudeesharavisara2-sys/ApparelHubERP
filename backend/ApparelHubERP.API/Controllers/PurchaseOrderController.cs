using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ProcurementOfficer,ManagerBoard,Admin")]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchaseOrderService _poService;

        public PurchaseOrderController(IPurchaseOrderService poService)
        {
            _poService = poService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _poService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _poService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Purchase Order not found." });
            return Ok(order);
        }

        [HttpGet("supplier/{supplierId}")]
        [Authorize(Roles = "Supplier")]
        public async Task<IActionResult> GetBySupplier(int supplierId)
        {
            var orders = await _poService.GetOrdersBySupplierAsync(supplierId);
            return Ok(orders);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePurchaseOrderDto dto)
        {
            try
            {
                var result = await _poService.CreatePurchaseOrderAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdatePurchaseOrderStatusDto dto)
        {
            try
            {
                var result = await _poService.UpdateOrderStatusAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/receive")]
        public async Task<IActionResult> ReceiveOrder(int id)
        {
            try
            {
                var result = await _poService.ReceiveOrderAsync(id);
                return Ok(new
                {
                    message = "Order received successfully. Stock updated.",
                    order = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reorder/suggestions")]
        public async Task<IActionResult> GetReorderSuggestions()
        {
            try
            {
                var suggestions = await _poService.GetReorderSuggestionsAsync();
                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}