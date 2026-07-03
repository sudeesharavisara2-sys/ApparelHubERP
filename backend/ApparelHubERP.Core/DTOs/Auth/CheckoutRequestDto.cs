using ApparelHubERP.Core.DTOs.Auth;

namespace ApparelHubERP.Core.DTOs.Auth
{
    public class CheckoutRequestDto
    {
        public string PaymentMethod { get; set; } = string.Empty;

        public List<CheckoutItemDto> Items { get; set; }
            = new List<CheckoutItemDto>();
    }
}