using TalentSphere.Application.Common.Models;
using Xunit;

namespace TalentSphere.Tests.Common;

public class PagedResultTests
{
    [Theory]
    [InlineData(25, 10, 3)]
    [InlineData(20, 10, 2)]
    [InlineData(1, 10, 1)]
    [InlineData(0, 10, 0)]
    public void TotalPages_ComputedFromCountAndPageSize(int totalCount, int pageSize, int expectedPages)
    {
        var result = new PagedResult<int> { TotalCount = totalCount, PageSize = pageSize };

        Assert.Equal(expectedPages, result.TotalPages);
    }

    [Fact]
    public void PageSize_ExceedingMax_IsClampedTo100()
    {
        var pagination = new PaginationParams { PageSize = 500 };

        Assert.Equal(100, pagination.PageSize);
    }

    [Fact]
    public void PageSize_ZeroOrNegative_FallsBackToDefaultOfTen()
    {
        var pagination = new PaginationParams { PageSize = 0 };
        Assert.Equal(10, pagination.PageSize);

        pagination.PageSize = -5;
        Assert.Equal(10, pagination.PageSize);
    }
}
