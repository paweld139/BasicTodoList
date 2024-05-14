using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BasicTodoList.DAL
{
    public class BasicTodoListContext(DbContextOptions options) : DbContext(options)
    {
        public virtual DbSet<Entities.Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
