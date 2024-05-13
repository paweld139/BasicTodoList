
using BasicTodoList.BLL.Contracts;
using BasicTodoList.BLL.Services;
using BasicTodoList.DAL;
using BasicTodoList.DAL.SampleData;
using BasicTodoList.Server.SerializerContexts;
using Microsoft.EntityFrameworkCore;

namespace BasicTodoList.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var services = builder.Services;

            var configuration = builder.Configuration;

            AddServices(services, configuration);

            var app = builder.Build();

            SeedDb(app);

            AddMiddlewares(app);

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }

        private static void AddMiddlewares(WebApplication app)
        {
            app.UseDefaultFiles();

            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();

                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
        }

        private static void AddServices(IServiceCollection services, ConfigurationManager configuration)
        {
            services.AddControllers();

            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<BasicTodoListContext>(o => o.UseSqlServer(connectionString, o => o.MigrationsAssembly("BasicTodoList.DAL")));

            services.ConfigureHttpJsonOptions(options =>
            {
                options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
            });

            services.AddScoped<ITaskService, TaskService>();

            services.AddScoped<BasicTodoListSeeder>();
        }

        private static void SeedDb(IHost host)
        {
            var scopeFactory = host.Services.GetRequiredService<IServiceScopeFactory>();

            using var scope = scopeFactory.CreateScope();

            var seeder = scope.ServiceProvider.GetRequiredService<BasicTodoListSeeder>();

            seeder.Seed().Wait();
        }
    }
}
