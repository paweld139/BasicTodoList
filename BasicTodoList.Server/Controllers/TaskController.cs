using BasicTodoList.BLL.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace BasicTodoList.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController(ITaskService taskService) : ControllerBase
    {
        public async Task<IActionResult> Get()
        {
            var result = await taskService.Get();

            return Ok(result);
        }
    }
}
