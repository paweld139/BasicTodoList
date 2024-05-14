using BasicTodoList.BLL.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BasicTodoList.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskController(ITaskService taskService) : ControllerBase
    {
        public async Task<IActionResult> Get()
        {
            var result = await taskService.Get();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await taskService.Get(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await taskService.Delete(id);

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> Post(DAL.Entities.Task task)
        {
            await taskService.Create(task);

            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        [HttpPut]
        public async Task<IActionResult> Put(DAL.Entities.Task task)
        {
            await taskService.Update(task);

            return NoContent();
        }
    }
}
