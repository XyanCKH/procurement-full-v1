using Microsoft.AspNetCore.Mvc;

namespace Procurement.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "Healthy",
                service = "ProcurementApi",
                version = "1.0.0"
            });
        }
    }
}
