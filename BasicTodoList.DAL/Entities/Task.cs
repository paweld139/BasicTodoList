namespace BasicTodoList.DAL.Entities
{
    public class Task
    {
        public int Id { get; set; }

        public required string Title { get; set; }

        public bool IsCompleted { get; set; }
    }
}
