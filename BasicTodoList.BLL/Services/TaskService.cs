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
            .ToListAsync();

        public Task<DAL.Entities.Task?> Get(int id) => basicTodoListContext.Tasks
            .Where(t => t.UserId == UserId)
            .SingleOrDefaultAsync(t => t.Id == id);

        public Task Delete(int id) => basicTodoListContext.Tasks
            .Where(t =>
                t.Id == id &&
                t.UserId == UserId
            )
            .ExecuteDeleteAsync();

        public Task Create(DAL.Entities.Task task)
        {
            task.UserId = UserId;

            basicTodoListContext.Tasks.Add(task);

            return basicTodoListContext.SaveChangesAsync();
        }

        public Task Update(DAL.Entities.Task task)
        {
            task.UserId = UserId;

            basicTodoListContext.Tasks.Update(task);

            return basicTodoListContext.SaveChangesAsync();
        }
    }
}
