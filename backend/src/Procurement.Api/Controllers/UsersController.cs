using Microsoft.AspNetCore.Mvc;
using Procurement.Core.Services;

namespace Procurement.Api.Controllers
{
    [ApiController]
    [Route("api/v1/procurement/users")]
    public class UsersController : ControllerBase
    {
        private readonly IEmployeeDirectoryService _employeeService;

        public UsersController(IEmployeeDirectoryService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> Search([FromQuery] string? q)
        {
            var results = await _employeeService.SearchEmployeesAsync(q ?? string.Empty);
            return Ok(results);
        }
    }
}
