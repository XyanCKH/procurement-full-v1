using Procurement.Core.Services;

namespace Procurement.Infrastructure.Services
{
    public class EmployeeDirectoryService : IEmployeeDirectoryService
    {
        private static readonly List<EmployeeDto> _directory = new()
        {
            new EmployeeDto { Id = "EMP10001", Name = "Ahmad Zulkarnain", Department = "Information Technology", Contact = "03-2161 8888", Email = "ahmad.z@enterprise.com" },
            new EmployeeDto { Id = "EMP10002", Name = "Siti Nurhaliza", Department = "Information Technology", Contact = "03-2161 7777", Email = "siti.n@enterprise.com" },
            new EmployeeDto { Id = "EMP10003", Name = "David Tan", Department = "Procurement & Sourcing", Contact = "03-2161 6666", Email = "david.tan@enterprise.com" },
            new EmployeeDto { Id = "EMP10004", Name = "Mei Ling", Department = "Risk & Compliance", Contact = "03-2161 5555", Email = "mei.ling@enterprise.com" },
            new EmployeeDto { Id = "EMP10005", Name = "Raj Kumar", Department = "Finance & Accounting", Contact = "03-2161 4444", Email = "raj.kumar@enterprise.com" },
            new EmployeeDto { Id = "EMP10006", Name = "Sarah Jenkins", Department = "Information Technology", Contact = "03-2161 3333", Email = "sarah.j@enterprise.com" },
            new EmployeeDto { Id = "EMP10007", Name = "Mohd Farhan", Department = "Legal & Secretarial", Contact = "03-2161 2222", Email = "farhan.m@enterprise.com" }
        };

        public Task<IEnumerable<EmployeeDto>> SearchEmployeesAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return Task.FromResult<IEnumerable<EmployeeDto>>(_directory);
            }

            var q = query.Trim().ToLower();
            var results = _directory.Where(e =>
                e.Name.ToLower().Contains(q) ||
                e.Department.ToLower().Contains(q) ||
                e.Id.ToLower().Contains(q) ||
                e.Email.ToLower().Contains(q)
            );

            return Task.FromResult(results);
        }

        public Task<EmployeeDto?> GetEmployeeByIdAsync(string employeeId)
        {
            if (string.IsNullOrWhiteSpace(employeeId))
            {
                return Task.FromResult<EmployeeDto?>(null);
            }

            var emp = _directory.FirstOrDefault(e => e.Id.Equals(employeeId, StringComparison.OrdinalIgnoreCase) || e.Name.Equals(employeeId, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(emp);
        }
    }
}
