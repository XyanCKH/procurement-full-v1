namespace Procurement.Core.Services
{
    public interface IEmployeeDirectoryService
    {
        Task<IEnumerable<EmployeeDto>> SearchEmployeesAsync(string query);
        Task<EmployeeDto?> GetEmployeeByIdAsync(string employeeId);
    }

    public class EmployeeDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
