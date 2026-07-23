using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TalentSphere.Application.Interfaces.Repositories;

namespace TalentSphere.Infrastructure.Persistence;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly ApplicationDbContext Context;
    protected readonly DbSet<T> DbSet;

    public GenericRepository(ApplicationDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default) => await DbSet.FindAsync([id], ct);

    public Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        DbSet.FirstOrDefaultAsync(predicate, ct);

    public IQueryable<T> Query(bool asNoTracking = false) => asNoTracking ? DbSet.AsNoTracking() : DbSet;

    public Task<List<T>> GetAllAsync(CancellationToken ct = default) => DbSet.ToListAsync(ct);

    public Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        DbSet.Where(predicate).ToListAsync(ct);

    public Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        DbSet.AnyAsync(predicate, ct);

    public Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default) =>
        predicate is null ? DbSet.CountAsync(ct) : DbSet.CountAsync(predicate, ct);

    public async Task AddAsync(T entity, CancellationToken ct = default) => await DbSet.AddAsync(entity, ct);

    public async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken ct = default) => await DbSet.AddRangeAsync(entities, ct);

    public void Update(T entity)
    {
        var entry = Context.Entry(entity);
        if (entry.State == EntityState.Detached)
            DbSet.Attach(entity);
        entry.State = EntityState.Modified;
    }

    public void Remove(T entity) => DbSet.Remove(entity);

    public void RemoveRange(IEnumerable<T> entities) => DbSet.RemoveRange(entities);
}
