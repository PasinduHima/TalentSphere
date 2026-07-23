using System.Linq.Expressions;

namespace TalentSphere.Application.Interfaces.Repositories;

/// <summary>
/// Generic repository abstraction (Repository Pattern) so services depend on
/// IUnitOfWork/IGenericRepository instead of EF Core's DbContext directly.
/// </summary>
public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);

    /// <summary>
    /// Returns a queryable for the entity. Tracked by default (asNoTracking: false)
    /// because lazy-loading proxies (see UseLazyLoadingProxies in DI setup) only
    /// resolve navigation properties on tracked entity instances.
    /// </summary>
    IQueryable<T> Query(bool asNoTracking = false);
    Task<List<T>> GetAllAsync(CancellationToken ct = default);
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken ct = default);
    void Update(T entity);
    void Remove(T entity);
    void RemoveRange(IEnumerable<T> entities);
}
