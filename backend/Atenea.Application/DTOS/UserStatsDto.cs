namespace Atenea.Application.DTOS
{
    // Aggregated user metrics for the admin dashboard.
    public class UserStatsDto
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int Inactive { get; set; }
        public int Admins { get; set; }
        public int Regular { get; set; }
    }
}
