namespace TalentSphere.Infrastructure.AI;

/// <summary>
/// A curated dictionary of recognizable technology/business skills used by the
/// rule-based resume parser and skill extractor. This models the "skill
/// extraction" AI capability without requiring an external NLP provider; swap
/// IResumeParsingService's implementation for a real model/API later.
/// </summary>
public static class SkillLexicon
{
    public static readonly string[] KnownSkills =
    [
        "C#", ".NET", "ASP.NET", "ASP.NET Core", "Entity Framework", "SQL Server", "SQL", "T-SQL",
        "Java", "Spring Boot", "Python", "Django", "Flask", "JavaScript", "TypeScript", "Node.js",
        "React", "Angular", "Vue", "Next.js", "Redux", "HTML", "HTML5", "CSS", "CSS3", "Tailwind CSS",
        "PHP", "Laravel", "Ruby", "Ruby on Rails", "Go", "Golang", "Rust", "C++", "C",
        "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Git", "GitHub",
        "REST", "RESTful API", "GraphQL", "gRPC", "Microservices", "Serverless",
        "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "RabbitMQ", "Kafka",
        "Agile", "Scrum", "Kanban", "Project Management", "JIRA",
        "Machine Learning", "Deep Learning", "Data Science", "TensorFlow", "PyTorch", "NLP",
        "Figma", "UI/UX", "Design Systems", "Prototyping", "Wireframing",
        "Communication", "Leadership", "Problem Solving", "Team Management", "Stakeholder Management",
        "Data Analysis", "Excel", "Power BI", "Tableau", "System Design", "Unit Testing", "TDD",
        "Swift", "Kotlin", "Flutter", "React Native", "iOS", "Android",
    ];
}
