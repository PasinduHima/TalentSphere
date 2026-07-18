using Microsoft.Extensions.Options;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Infrastructure.Options;

namespace TalentSphere.Infrastructure.Services;

/// <summary>
/// Local-disk file storage. The abstraction (IFileStorageService) allows this
/// to be swapped for Azure Blob Storage / AWS S3 in a cloud deployment
/// without touching calling code.
/// </summary>
public class FileStorageService : IFileStorageService
{
    private readonly string _rootPath;

    public FileStorageService(IOptions<FileStorageOptions> options)
    {
        _rootPath = Path.IsPathRooted(options.Value.RootPath)
            ? options.Value.RootPath
            : Path.Combine(AppContext.BaseDirectory, options.Value.RootPath);

        Directory.CreateDirectory(_rootPath);
    }

    public async Task<string> SaveAsync(Stream content, string fileName, string containerName, CancellationToken ct = default)
    {
        var containerPath = Path.Combine(_rootPath, containerName);
        Directory.CreateDirectory(containerPath);

        var safeFileName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
        var fullPath = Path.Combine(containerPath, safeFileName);

        content.Position = 0;
        await using var fileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
        await content.CopyToAsync(fileStream, ct);

        return Path.Combine(containerName, safeFileName).Replace('\\', '/');
    }

    public Task<Stream?> GetAsync(string storagePath, CancellationToken ct = default)
    {
        var fullPath = Path.Combine(_rootPath, storagePath);
        if (!File.Exists(fullPath))
            return Task.FromResult<Stream?>(null);

        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
        return Task.FromResult<Stream?>(stream);
    }

    public Task DeleteAsync(string storagePath, CancellationToken ct = default)
    {
        var fullPath = Path.Combine(_rootPath, storagePath);
        if (File.Exists(fullPath))
            File.Delete(fullPath);
        return Task.CompletedTask;
    }
}
