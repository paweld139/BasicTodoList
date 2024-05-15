using BasicTodoList.BLL.Contracts;
using BasicTodoList.DAL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BasicTodoList.BLL.Services
{
    public class TaskService(BasicTodoListContext basicTodoListContext, IHttpContextAccessor httpContextAccessor, UserManager<IdentityUser> userManager) : ITaskService
    {
        private ClaimsPrincipal User => httpContextAccessor.HttpContext.User;

        private string? UserId => userManager.GetUserId(User);

        public Task<List<DAL.Entities.Task>> Get() => basicTodoListContext.Tasks
            .Where(t => t.UserId == UserId)
            .OrderBy(t => t.OrderIndex)
            .ToListAsync();

        public Task<DAL.Entities.Task?> Get(int id) => basicTodoListContext.Tasks
            .Where(t => t.UserId == UserId)
            .SingleOrDefaultAsync(t => t.Id == id);

        public async Task Delete(int id)
        {
            var task = await basicTodoListContext.Tasks
                .Where(t =>
                    t.Id == id &&
                    t.UserId == UserId
                )
                .SingleOrDefaultAsync();

            if (task == null)
            {
                return;
            }

            await basicTodoListContext.Tasks
                .Where(t =>
                    t.UserId == UserId &&
                    t.OrderIndex > task.OrderIndex
                )
                .ForEachAsync(t => t.OrderIndex--);

            await basicTodoListContext.Tasks
                .Where(t =>
                    t.Id == id &&
                    t.UserId == UserId
                )
                .ExecuteDeleteAsync();

            await basicTodoListContext.SaveChangesAsync();
        }

        public async Task Create(DAL.Entities.Task task)
        {
            task.UserId = UserId;

            task.OrderIndex = await basicTodoListContext.Tasks
                .Where(t => t.UserId == UserId)
                .Select(t => t.OrderIndex)
                .MaxAsync() + 1;

            basicTodoListContext.Tasks.Add(task);

            await basicTodoListContext.SaveChangesAsync();
        }

        public Task Update(DAL.Entities.Task task)
        {
            task.UserId = UserId;

            basicTodoListContext.Tasks.Update(task);

            return basicTodoListContext.SaveChangesAsync();
        }

        public async Task MoveUp(DAL.Entities.Task task)
        {
            var previousTask = await basicTodoListContext.Tasks
                .Where(t =>
                    t.UserId == UserId &&
                    t.OrderIndex < task.OrderIndex
                )
                .OrderByDescending(t => t.OrderIndex)
                .FirstOrDefaultAsync();

            if (previousTask == null)
            {
                return;
            }

            (previousTask.OrderIndex, task.OrderIndex) = (task.OrderIndex, previousTask.OrderIndex);

            basicTodoListContext.Tasks.UpdateRange(task, previousTask);

            await basicTodoListContext.SaveChangesAsync();
        }

        public async Task MoveDown(DAL.Entities.Task task)
        {
            var nextTask = await basicTodoListContext.Tasks
                .Where(t =>
                    t.UserId == UserId &&
                    t.OrderIndex > task.OrderIndex
                )
                .OrderBy(t => t.OrderIndex)
                .FirstOrDefaultAsync();

            if (nextTask == null)
            {
                return;
            }

            (nextTask.OrderIndex, task.OrderIndex) = (task.OrderIndex, nextTask.OrderIndex);

            basicTodoListContext.Tasks.UpdateRange(task, nextTask);

            await basicTodoListContext.SaveChangesAsync();
        }
    }
}
