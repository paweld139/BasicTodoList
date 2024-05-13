using Microsoft.EntityFrameworkCore;

namespace BasicTodoList.DAL
{
    public class BasicTodoListContext(DbContextOptions options) : DbContext(options)
    {
        public virtual DbSet<Entities.Task> Tasks { get; set; }
    }
}
