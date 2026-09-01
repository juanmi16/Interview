namespace Atenea.Application.DTOS
{
    // What the client sends to create a to-do.
    public class CreateTodoDto
    {
        public string Title { get; set; } = string.Empty;
    }
}
