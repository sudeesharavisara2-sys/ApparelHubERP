using System.Diagnostics;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Infrastructure.Data;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ApparelHubERP.Core.Services;
using ApparelHubERP.Core.Interfaces.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Connecting the DbContext to SQL Server and the Connection String
builder.Services.AddDbContext<ApparelHubERPContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found")))
        };
    });

builder.Services.AddAuthorization();
//builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// ✅ IInventoryService register
builder.Services.AddScoped<IInventoryService, InventoryService>(provider =>
{
    var context = provider.GetRequiredService<ApparelHubERPContext>();
    return new InventoryService(context);
});

// ✅ IEmailService register
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();

    app.UseSwagger();

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApparelHubERP API v1");
        c.RoutePrefix = string.Empty;
    });

    // ✅ The code that auto-opens the browser when the server starts
    var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
    lifetime.ApplicationStarted.Register(() =>
    {
        var url = app.Urls.FirstOrDefault() ?? "https://localhost:7001";
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            });
        }
        catch { /* The app doesn't crash even if the browser isn't open. */ }
    });
}

app.UseHttpsRedirection();

// ✅ Authentication & Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ---- AUTOMATIC DATABASE CREATION & MIGRATION ----
// To auto-create the database and tables the first time the project is launched:
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApparelHubERPContext>();
        // Check for pending migrations and auto-create the apparelhub_db database on the machine.
        context.Database.Migrate();
        Console.WriteLine("--> Database & Tables created successfully on the local machine!");

        // ✅ SEED TEST USERS
        if (!context.Users.Any())
        {
            context.Users.AddRange(
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "storemanager",
                    PasswordHash = ApparelHubERP.Core.Services.AuthService.HashPassword("123456"),
                    Role = "StoreManager",
                    Email = "storemanager@test.com",
                    IsEmailVerified = true
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "hr",
                    PasswordHash = ApparelHubERP.Core.Services.AuthService.HashPassword("123456"),
                    Role = "HR",
                    Email = "hr@test.com",
                    IsEmailVerified = true
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "admin",
                    PasswordHash = ApparelHubERP.Core.Services.AuthService.HashPassword("123456"),
                    Role = "Admin",
                    Email = "admin@test.com",
                    IsEmailVerified = true
                }
            );
            context.SaveChanges();
            Console.WriteLine("--> Test users created successfully!");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> Error while creating database: {ex.Message}");
    }
}

// --- Default WeatherForecast Endpoint (currently kept for testing only) ---
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}