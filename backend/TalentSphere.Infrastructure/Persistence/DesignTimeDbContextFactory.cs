using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TalentSphere.Infrastructure.Persistence;

/// <summary>
/// Allows `dotnet ef migrations add` to be run from the Infrastructure project
/// without needing the API host to be built first.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("TALENTSPHERE_CONNECTION_STRING")
            ?? "Server=(localdb)\\mssqllocaldb;Database=TalentSphereDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
