using System.Diagnostics;
using System.Text;
using ApparelHubERP.Core.Interfaces.Services;
using ApparelHubERP.Core.Services;
using ApparelHubERP.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApparelHubERPContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<DbContext>(provider =>
    provider.GetRequiredService<ApparelHubERPContext>());

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

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
<<<<<<< HEAD

=======
//builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
>>>>>>> origin/dev-yathushiha
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

<<<<<<< HEAD
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "ApparelHubERP API",
        Description = "Official API documentation for the ApparelHub ERP System."
    });
=======
// ✅ IInventoryService register
builder.Services.AddScoped<IInventoryService, InventoryService>(provider =>
{
    var context = provider.GetRequiredService<ApparelHubERPContext>();
    return new InventoryService(context);
});
>>>>>>> origin/dev-yathushiha

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter JWT like: Bearer {token}",
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
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
<<<<<<< HEAD
=======
    // app.MapOpenApi();

>>>>>>> origin/dev-yathushiha
    app.UseSwagger();

    app.UseSwaggerUI(c =>
    {
<<<<<<< HEAD
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ApparelHubERP API v1");
        options.RoutePrefix = string.Empty;
=======
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApparelHubERP API v1");
        c.RoutePrefix = string.Empty;
>>>>>>> origin/dev-yathushiha
    });

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
        catch
        {
        }
    });
}

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApparelHubERPContext>();

        context.Database.Migrate();

        Console.WriteLine("--> Database & tables created successfully.");

        if (!context.Users.Any())
        {
            context.Users.AddRange(
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "admin",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "Admin",
                    Email = "admin@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
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
                    Role = "HROfficer",
                    Email = "hr@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "payroll",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "PayrollOfficer",
                    Email = "payroll@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "inventory",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "InventoryManager",
                    Email = "inventory@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "procurement",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "ProcurementOfficer",
                    Email = "procurement@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "cashier",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "SalesCashier",
                    Email = "cashier@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new ApparelHubERP.Core.Entities.User
                {
                    Username = "executive",
                    PasswordHash = AuthService.HashPassword("123456"),
                    Role = "ExecutiveBoard",
                    Email = "executive@test.com",
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                }
            );

            context.SaveChanges();
            Console.WriteLine("--> Test users created successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> Error while creating database: {ex.Message}");
    }
}

app.Run();