using System.Diagnostics;
using System.Text;
using ApparelHubERP.Core.Interfaces.Services;
using ApparelHubERP.Core.Services;
using ApparelHubERP.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<ApparelHubERPContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// IMPORTANT FIX: AuthService constructor needs DbContext
builder.Services.AddScoped<DbContext>(provider =>
    provider.GetRequiredService<ApparelHubERPContext>());

// JWT Authentication
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
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]
                    ?? throw new InvalidOperationException("JWT Key not found")))
        };
    });

builder.Services.AddAuthorization();

// ✅ Required for Endpoints in .NET 8 / .NET 9
builder.Services.AddEndpointsApiExplorer();

// ✅ SwaggerGen Config with Server URLs and Security Lock
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "ApparelHubERP API",
        Description = "Official API documentation for the ApparelHub ERP System."
    });

    // Adding Server Addresses (HTTP & HTTPS)
    options.AddServer(new Microsoft.OpenApi.Models.OpenApiServer { Url = "https://localhost:7270", Description = "Secure Development Server (HTTPS)" });
    options.AddServer(new Microsoft.OpenApi.Models.OpenApiServer { Url = "http://localhost:5024", Description = "Local Development Server (HTTP)" });

    // Adding JWT Bearer Auth to Swagger (For the Lock Icon)
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field. Example: 'Bearer {token}'",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddControllers();

// ✅ IAuthService registration
builder.Services.AddScoped<IAuthService, AuthService>(provider =>
{
    var context = provider.GetRequiredService<ApparelHubERPContext>();
    var configuration = provider.GetRequiredService<IConfiguration>();
    return new AuthService(context, configuration);
});

// ✅ IEmailService registration
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ApparelHubERP API v1");
        options.RoutePrefix = string.Empty; // Set Swagger UI as the application root
    });

    // ✅ Auto-opens the browser when the server starts
    var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
    lifetime.ApplicationStarted.Register(() =>
    {
        var url = app.Urls.FirstOrDefault() ?? "https://localhost:7270";
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            });
        }
        catch { /* Application won't crash even if the browser fails to open */ }
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ---- AUTOMATIC DATABASE CREATION & MIGRATION ----
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = services.GetRequiredService<ApparelHubERPContext>();
        context.Database.Migrate();

        Console.WriteLine("--> Database & Tables created successfully!");

        if (!context.Users.Any())
        {
            context.Users.AddRange(
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "storemanager",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "StoreManager",
                    Email = "storemanager@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "hr",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "HR",
                    Email = "hr@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "admin",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "Admin",
                    Email = "admin@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
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

app.Run();