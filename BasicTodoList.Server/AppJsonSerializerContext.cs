using System.Text.Json.Serialization;

namespace BasicTodoList.Server.SerializerContexts
{
    [JsonSerializable(typeof(IEnumerable<Task>))]
    internal partial class AppJsonSerializerContext : JsonSerializerContext
    {
    }
}
