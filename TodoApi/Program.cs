


// app.MapGet("/", () => "Hello World!");





// 

using Microsoft.EntityFrameworkCore;
using TodoApi;
var builder = WebApplication.CreateBuilder(args);

// הוספת שירות CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // מאפשר לכל אתר לגשת
              .AllowAnyMethod()   // מאפשר את כל הפעולות (GET, POST וכו')
              .AllowAnyHeader();  // מאפשר את כל הכותרות
    });
});


// וגם using לשם של הפרויקט שלך כדי שיכיר את ה-Context
var connectionString = builder.Configuration.GetConnectionString("ToDoDB");
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
var app = builder.Build();
app.UseCors("AllowAll");

app.MapGet("/",  async () => "api is running");

    // 1. שליפת כל המשימות - GET
app.MapGet("/items", async (ToDoDbContext db) => 
    await db.Items.ToListAsync());

// 2. הוספת משימה חדשה - POST
app.MapPost("/items", async (ToDoDbContext db, Item item) => {
    // אין צורך לשלוח ID, ה-DB ייצור אותו
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
});

// 3. עדכון משימה (למשל שינוי סטטוס השלמה) - PUT
app.MapPut("/items/{id}", async (ToDoDbContext db, int id, Item inputItem) => {
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    // אנחנו מעדכנים את הקיים, לא יוצרים חדש!
    item.Name = inputItem.Name;
    item.IsComplete = inputItem.IsComplete;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// 4. מחיקת משימה - DELETE
app.MapDelete("/items/{id}", async (ToDoDbContext db, int id) => {
    if (await db.Items.FindAsync(id) is Item item) {
        db.Items.Remove(item);
        await db.SaveChangesAsync();
        return Results.Ok(item);
    }
    return Results.NotFound();
});


app.Run();