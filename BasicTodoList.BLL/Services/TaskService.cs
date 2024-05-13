using BasicTodoList.BLL.Contracts;
using BasicTodoList.DAL;
using Microsoft.EntityFrameworkCore;

namespace BasicTodoList.BLL.Services
{
    public class TaskService(BasicTodoListContext basicTodoListContext) : ITaskService
    {
        public Task<List<DAL.Entities.Task>> Get() => basicTodoListContext.Tasks.ToListAsync();

        public Task<DAL.Entities.Task?> Get(int id) => basicTodoListContext.Tasks.SingleOrDefaultAsync(t => t.Id == id);

        public Task Delete(int id) => basicTodoListContext.Tasks.Where(t => t.Id == id).ExecuteDeleteAsync();

        public Task Create(DAL.Entities.Task task)
        {
            basicTodoListContext.Tasks.Add(task);

            return basicTodoListContext.SaveChangesAsync();
        }

        public Task Update(DAL.Entities.Task task)
        {
            basicTodoListContext.Tasks.Update(task);

            return basicTodoListContext.SaveChangesAsync();
        }
    }
}
