using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Text.Json;

namespace BasicTodoList.DAL.SampleData
{
    public class BasicTodoListSeeder(BasicTodoListContext basicTodoListContext)
    {
        private async Task Migrate()
        {
            var pendingMigrations = await basicTodoListContext.Database.GetPendingMigrationsAsync();

            var canMigrate = pendingMigrations.Any();

            if (canMigrate)
            {
                await basicTodoListContext.Database.MigrateAsync();
            }
        }

        private async Task SeedData()
        {
            var tasksExist = await basicTodoListContext.Tasks.AnyAsync();

            if (tasksExist)
            {
                return;
            }

            var location = Assembly.GetEntryAssembly()?.Location;

            var directory = Path.GetDirectoryName(location);

            if (directory is null)
            {
                return;
            }

            var path = Path.Combine(directory, "SampleData", "Tasks.json");

            var text = await File.ReadAllTextAsync(path);

            var tasks = JsonSerializer.Deserialize<List<Entities.Task>>(text);

            if (tasks is null)
            {
                return;
            }

            basicTodoListContext.Tasks.AddRange(tasks);

            await basicTodoListContext.SaveChangesAsync();
        }

        public async Task Seed()
        {
            await Migrate();

            await SeedData();
        }
    }
}
