using System;
using System.Linq;
using Procurement.Core.Entities;
using Procurement.Core.Enums;

namespace Procurement.Core.Validators
{
    public class ValidationResult
    {
        public bool IsValid => Errors.Count == 0;
        public Dictionary<string, string[]> Errors { get; set; } = new Dictionary<string, string[]>();

        public void AddError(string field, string message)
        {
            if (!Errors.ContainsKey(field))
            {
                Errors[field] = new[] { message };
            }
            else
            {
                var list = Errors[field].ToList();
                list.Add(message);
                Errors[field] = list.ToArray();
            }
        }
    }

    public static class FinalSubmissionValidator
    {
        public static ValidationResult Validate(ProcurementRequest request, System.Collections.Generic.IEnumerable<RequestDocument> documents)
        {
            var result = new ValidationResult();

            // 1. Category non-empty (if Other Query, query details >= 10 chars).
            if (request.Category == ProcurementCategory.OTHER_QUERY)
            {
                if (string.IsNullOrWhiteSpace(request.QueryDetails) || request.QueryDetails.Trim().Length < 10)
                {
                    result.AddError("queryDetails", "Query details must be at least 10 characters for Other Query category.");
                }
            }

            // 2. Renewal requires previous CMT ID.
            if (request.RequestType == RequestType.RENEWAL)
            {
                if (string.IsNullOrWhiteSpace(request.PreviousCmtId))
                {
                    result.AddError("previousCmtId", "Previous CMT ID is required for renewal requests.");
                }
            }

            // 3. Description between 20 and 2000 characters.
            if (string.IsNullOrWhiteSpace(request.Description) || request.Description.Trim().Length < 20 || request.Description.Trim().Length > 2000)
            {
                result.AddError("description", "Description must be between 20 and 2000 characters.");
            }

            var docList = documents?.ToList() ?? new System.Collections.Generic.List<RequestDocument>();

            // 4. Outsourcing = Yes requires outsourcing document.
            if (request.IsOutsourcing)
            {
                var hasOutsourcingDoc = docList.Any(d => d.DocumentType.Equals("OUTSOURCING", StringComparison.OrdinalIgnoreCase));
                if (!hasOutsourcingDoc)
                {
                    result.AddError("isOutsourcing", "Outsourcing engagement requires an attached outsourcing document.");
                }
            }

            // 5. Budget must be > 0.00 unless is_budget_tbd = true.
            if (!request.IsBudgetTbd)
            {
                if (!request.BudgetAmount.HasValue || request.BudgetAmount.Value <= 0)
                {
                    result.AddError("budgetAmount", "Budget must be greater than 0.00 unless budget is TBD.");
                }
            }

            // 6. Target End Date must be >= tomorrow.
            var tomorrow = DateTime.UtcNow.Date.AddDays(1);
            if (request.TargetEndDate.Date < tomorrow)
            {
                result.AddError("targetEndDate", "Target End Date must be at least tomorrow.");
            }

            // 7. Business Case document must exist and have virus_scan_status == CLEAN.
            var businessCaseDoc = docList.FirstOrDefault(d => d.DocumentType.Equals("BUSINESS_CASE", StringComparison.OrdinalIgnoreCase) || d.DocumentType.Equals("BUSINESS-CASE", StringComparison.OrdinalIgnoreCase));
            if (businessCaseDoc == null)
            {
                result.AddError("businessCaseDocument", "Business Case document must exist.");
            }
            else if (!businessCaseDoc.VirusScanStatus.Equals("CLEAN", StringComparison.OrdinalIgnoreCase))
            {
                result.AddError("businessCaseDocument", "Business Case document must have CLEAN virus scan status.");
            }

            // 8. DeclarationConfirmed must be true.
            if (!request.DeclarationConfirmed)
            {
                result.AddError("declarationConfirmed", "Declaration confirmation must be true.");
            }

            return result;
        }
    }
}
