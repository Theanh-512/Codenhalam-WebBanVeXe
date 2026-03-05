using Microsoft.AspNetCore.Mvc;

namespace BusTicketing.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthCheckController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "Healthy", message = "API is running correctly", timestamp = DateTime.UtcNow });
        }
    }
}
