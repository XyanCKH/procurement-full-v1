using System.Threading.Tasks;
using Procurement.Core.Entities;

namespace Procurement.Core.Services
{
    public interface INotificationService
    {
        Task SendRequestSubmittedNotificationAsync(ProcurementRequest request, string requesterEmail);
        Task SendRequestReturnedForInfoNotificationAsync(ProcurementRequest request, string requesterEmail, string reviewerComments);
        Task SendRequestWithdrawnNotificationAsync(ProcurementRequest request, string requesterEmail);
        Task SendNewRequestTriageAlertAsync(ProcurementRequest request, string triageEmail);
    }
}
