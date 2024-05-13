namespace BasicTodoList.BLL.Contracts
{
    public interface ITaskService
    {
        Task<List<DAL.Entities.Task>> Get();
    }
}