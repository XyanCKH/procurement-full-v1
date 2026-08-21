using System.Threading.Tasks;

namespace Procurement.Core.Services
{
    public interface IRequestIdGenerator
    {
        Task<string> GenerateIdAsync();
    }
}
