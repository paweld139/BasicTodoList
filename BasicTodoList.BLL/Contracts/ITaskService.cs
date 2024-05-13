namespace BasicTodoList.BLL.Contracts
{
    public interface ITaskService
    {
        Task Create(DAL.Entities.Task task);
        Task Delete(int id);
        Task<List<DAL.Entities.Task>> Get();
        Task<DAL.Entities.Task?> Get(int id);
        Task Update(DAL.Entities.Task task);
    }
}