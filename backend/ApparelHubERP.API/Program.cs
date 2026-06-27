using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Infrastructure.Data;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// 1. DbContext එක SQL Server සහ Connection String එක එක්ක සම්බන්ධ කිරීම
builder.Services.AddDbContext<ApparelHubERPContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "ApparelHubERP API v1");
        options.RoutePrefix = string.Empty;
    });

    // ✅ Server start වූ ගමන් browser auto-open වෙන කෝඩ් එක
    var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
    lifetime.ApplicationStarted.Register(() =>
    {
        var url = app.Urls.FirstOrDefault() ?? "https://localhost:7001";
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true   // Windows/Mac/Linux ගේ default browser open කරනවා
            });
        }
        catch { /* Browser open වුණේ නැතත් app crash වෙන්නේ නෑ */ }
    });
}

app.UseHttpsRedirection();
app.MapControllers();

// ---- AUTOMATIC DATABASE CREATION & MIGRATION ----
// ප්‍රොජෙක්ට් එක රන් වෙන පළමු වතාවෙම ඩේටාබේස් එක සහ ටේබල්ස් ඔටෝ හැදීමට:
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApparelHubERPContext>();
        // Pending මයිග්‍රේෂන් බලලා apparelhub_db ඩේටාබේස් එක මැෂින් එකේ ඔටෝ ක්‍රියේට් කරයි
        context.Database.Migrate();
        Console.WriteLine("--> Database & Tables created successfully on the local machine!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> Error while creating database: {ex.Message}");
    }
}

// --- Default WeatherForecast Endpoint (දැනට ටෙස්ට් කරන්න විතරක් තියාගත්තා) ---
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