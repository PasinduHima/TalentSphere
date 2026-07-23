using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TalentSphere.Domain.Entities;
using TalentSphere.Infrastructure.Persistence;
using Xunit;

namespace TalentSphere.Tests.Persistence;

public class GenericRepositoryTests
{
    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task AddAsync_ThenQuery_ReturnsPersistedEntity()
    {
        await using var context = CreateContext();
        var repository = new GenericRepository<Organization>(context);

        var org = new Organization { Name = "Acme Corp" };
        await repository.AddAsync(org);
        await context.SaveChangesAsync();

        var found = await repository.FirstOrDefaultAsync(o => o.Name == "Acme Corp");

        Assert.NotNull(found);
        Assert.Equal(org.Id, found!.Id);
    }

    [Fact]
    public async Task Remove_DeletesEntity()
    {
        await using var context = CreateContext();
        var repository = new GenericRepository<Skill>(context);

        var skill = new Skill { Name = "C#" };
        await repository.AddAsync(skill);
        await context.SaveChangesAsync();

        repository.Remove(skill);
        await context.SaveChangesAsync();

        var exists = await repository.AnyAsync(s => s.Name == "C#");
        Assert.False(exists);
    }

    [Fact]
    public async Task CountAsync_WithPredicate_CountsMatchingRowsOnly()
    {
        await using var context = CreateContext();
        var repository = new GenericRepository<Skill>(context);

        await repository.AddRangeAsync(new[]
        {
            new Skill { Name = "C#", Category = "Backend" },
            new Skill { Name = "React", Category = "Frontend" },
            new Skill { Name = "SQL Server", Category = "Backend" },
        });
        await context.SaveChangesAsync();

        var backendCount = await repository.CountAsync(s => s.Category == "Backend");

        Assert.Equal(2, backendCount);
    }

    [Fact]
    public async Task UnitOfWork_SaveChangesAsync_PersistsAcrossMultipleRepositories()
    {
        await using var context = CreateContext();
        var unitOfWork = new UnitOfWork(context);

        var org = new Organization { Name = "NSBM Talent Consulting" };
        await unitOfWork.Organizations.AddAsync(org);

        var department = new Department { Name = "Engineering", OrganizationId = org.Id };
        await unitOfWork.Departments.AddAsync(department);

        var savedCount = await unitOfWork.SaveChangesAsync();

        Assert.Equal(2, savedCount);
        Assert.True(await unitOfWork.Organizations.AnyAsync(o => o.Id == org.Id));
        Assert.True(await unitOfWork.Departments.AnyAsync(d => d.OrganizationId == org.Id));
    }
}
