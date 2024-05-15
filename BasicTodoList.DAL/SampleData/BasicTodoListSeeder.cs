using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Text.Json;

namespace BasicTodoList.DAL.SampleData
{
    public class BasicTodoListSeeder(BasicTodoListContext basicTodoListContext, UserManager<IdentityUser> userManager)
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

        private async Task SeedTasks()
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

            var user = await userManager.Users.FirstAsync();

            var orderIndex = 0;

            tasks.ForEach(t =>
            {
                t.UserId = user.Id;

                t.OrderIndex = orderIndex++;
            });

            basicTodoListContext.Tasks.AddRange(tasks);

            await basicTodoListContext.SaveChangesAsync();
        }

        private async Task CreateUser(string userName, string password)
        {
            if (userManager == null)
            {
                return;
            }

            var userExists = await userManager.Users.AnyAsync(u => u.UserName == userName);

            if (!userExists)
            {
                var user = new IdentityUser(userName)
                {
                    Email = userName
                };

                var result = await userManager.CreateAsync(user, password);

                if (result != IdentityResult.Success)
                {
                    throw new InvalidOperationException("Could not create user in Seeding");
                }
            }
        }

        private Task SeedUsers() => CreateUser("paweldywan@paweldywan.com", "P@ssw0rd");

        private async Task SeedData()
        {
            await SeedUsers();

            await SeedTasks();
        }

        public async Task Seed()
        {
            await Migrate();

            await SeedData();
        }
    }
}
