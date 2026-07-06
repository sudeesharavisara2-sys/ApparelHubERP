using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ProcurementOfficer,ManagerBoard,Admin")]
    public class PurchaseOrderController(IPurchaseOrderService poService) : ControllerBase
    {
        private readonly IPurchaseOrderService _poService = poService;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _poService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("filtered")]
        public async Task<IActionResult> GetFiltered([FromQuery] PurchaseOrderFilterDto filter)
        {
            var result = await _poService.GetFilteredAsync(filter);
            return Ok(result);
        }

        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeleted()
        {
            var result = await _poService.GetDeletedAsync();
            return Ok(result);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStatistics()
        {
            var stats = await _poService.GetStatisticsAsync();
            return Ok(stats);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _poService.GetOrderByIdAsync(id);
            if (order is null)
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

        // ✅ NEW: Soft Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            try
            {
                await _poService.SoftDeleteAsync(id);
                return Ok(new { message = "Order soft-deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ NEW: Restore
        [HttpPatch("{id}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            try
            {
                await _poService.RestoreAsync(id);
                return Ok(new { message = "Order restored successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ NEW: Bulk Delete
        [HttpDelete("bulk-delete")]
        public async Task<IActionResult> BulkDelete([FromBody] BulkOperationDto dto)
        {
            try
            {
                await _poService.BulkDeleteAsync(dto);
                return Ok(new { message = $"{dto.Ids.Count} orders deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ NEW: Cancel Order
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            try
            {
                await _poService.CancelOrderAsync(id);
                return Ok(new { message = "Order cancelled successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/items")]
        public async Task<IActionResult> UpdateItems(int id, [FromBody] UpdateOrderItemsDto dto)
        {
            try
            {
                await _poService.UpdateOrderItemsAsync(id, dto);
                return Ok(new { message = "Order items updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ✅ NEW: Remove Item
        [HttpDelete("{orderId}/items/{itemId}")]
        public async Task<IActionResult> RemoveItem(int orderId, int itemId)
        {
            try
            {
                await _poService.RemoveItemAsync(orderId, itemId);
                return Ok(new { message = "Item removed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}