using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Force the environment to Development mode
builder.Environment.EnvironmentName = Environments.Development;

// Lock the application port to 5197
builder.WebHost.UseUrls("http://localhost:5197");

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "ApparelHubERP API v1");
    });

    // Automatically open the default browser when the app starts
    Task.Run(() => {
        Thread.Sleep(1000); // Wait 1 second for the server to spin up
        Process.Start(new ProcessStartInfo
        {
            FileName = "http://localhost:5197/swagger",
            UseShellExecute = true
        });
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();