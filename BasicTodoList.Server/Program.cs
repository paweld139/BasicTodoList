
using BasicTodoList.BLL.Contracts;
using BasicTodoList.BLL.Services;
using BasicTodoList.DAL;
using BasicTodoList.DAL.SampleData;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
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

            var environment = builder.Environment;

            AddServices(services, configuration, environment);

            var app = builder.Build();

            SeedDb(app);

            AddMiddlewares(app);

            app.MapControllers();

            app.MapRazorPages();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }

        private static void AddMiddlewares(WebApplication app)
        {
            app.UseDefaultFiles();

            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseMigrationsEndPoint();

                app.UseSwagger();

                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();
        }

        private static void AddServices(IServiceCollection services, ConfigurationManager configuration, IWebHostEnvironment webHostEnvironment)
        {
            services.AddControllers();

            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen();

            ConfigureDatabase(services, configuration, webHostEnvironment);

            ConfigureIdentity(services);

            services.AddScoped<ITaskService, TaskService>();

            services.AddScoped<BasicTodoListSeeder>();
        }

        private static void ConfigureIdentity(IServiceCollection services)
        {
            services.AddDefaultIdentity<IdentityUser>()
                .AddEntityFrameworkStores<BasicTodoListContext>();

            services.AddDataProtection()
                .PersistKeysToDbContext<BasicTodoListContext>();

            services.AddAuthorization();

            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToAccessDenied = context =>
                {
                    if (!context.Request.Path.StartsWithSegments("/Identity"))
                    {
                        context.Response.StatusCode = 403;
                    }
                    else
                    {
                        context.Response.Redirect(options.AccessDeniedPath);
                    }

                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToLogin = context =>
                {
                    if (!context.Request.Path.StartsWithSegments("/Identity"))
                    {
                        context.Response.StatusCode = 401;
                    }
                    else
                    {
                        context.Response.Redirect(options.LoginPath);
                    }

                    return Task.CompletedTask;
                };
            });
        }

        private static void ConfigureDatabase(IServiceCollection services, ConfigurationManager configuration, IWebHostEnvironment webHostEnvironment)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<BasicTodoListContext>(o => o.UseSqlServer(connectionString, o => o.MigrationsAssembly("BasicTodoList.DAL")));

            var isDevelopment = webHostEnvironment.IsDevelopment();

            if (isDevelopment)
                services.AddDatabaseDeveloperPageExceptionFilter();
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
