var builder = WebApplication.CreateBuilder(args);

//  Add CORS 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


    app.UseSwagger();
    app.UseSwaggerUI();


app.UseCors("AllowAll");

// --- GAME LOGIC ---
app.MapGet("/Game/GetCpuChoice", () =>
{
    string[] choices = { "Rock", "Paper", "Scissors", "Lizard", "Spock" };
    Random rand = new Random();
    int index = rand.Next(choices.Length);
    return choices[index];
})
.WithOpenApi(); 

app.Run();