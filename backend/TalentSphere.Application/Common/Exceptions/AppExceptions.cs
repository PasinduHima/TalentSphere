namespace TalentSphere.Application.Common.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string entity, object key)
        : base($"{entity} with identifier '{key}' was not found.") { }
}

public class ValidationAppException : Exception
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationAppException(string message) : base(message)
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationAppException(IDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = errors;
    }
}

public class ForbiddenAppException : Exception
{
    public ForbiddenAppException(string message = "You do not have permission to perform this action.")
        : base(message) { }
}

public class ConflictAppException : Exception
{
    public ConflictAppException(string message) : base(message) { }
}
