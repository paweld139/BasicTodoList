using BasicTodoList.BLL.Contracts;
using BasicTodoList.DAL;
using Microsoft.EntityFrameworkCore;

namespace BasicTodoList.BLL.Services
{
    public class TaskService(BasicTodoListContext basicTodoListContext) : ITaskService
    {
        public Task<List<DAL.Entities.Task>> Get() => basicTodoListContext.Tasks.ToListAsync();
    }
}
