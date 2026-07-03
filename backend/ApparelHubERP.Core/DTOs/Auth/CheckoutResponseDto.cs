namespace ApparelHubERP.Core.DTOs.Auth
{
    public class CheckoutResponseDto
    {
        public int SaleId { get; set; }

        public decimal TotalAmount { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}