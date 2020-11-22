# Add database to a microservice
Database first approach

### prerequisites 
- MySql Database
- C# project (Asp.net Core)

## step by step
* ##### Step 1: Install dotnet tools (admin required if install is -g(global))
```bash
$ sudo dotnet install tools -g
```
* ##### Step 2: Install the packages.
```bash
$ cd service
$ dotnet add package Microsoft.EntityFrameworkCore -v 5.0.0 
$ dotnet add package Pomelo.EntityFrameworkCore.MySql -v 5.0.0-alpha.2 
$ dotnet add package Microsoft.EntityFrameworkCore.Design -v 5.0.0
```
> or install using package manager console in visual studio or the manage package interface from nuget
```packagemanager
$ Install-Package Microsoft.EntityFrameworkCore -Version 5.0.0 
$ Install-Package Pomelo.EntityFrameworkCore.MySql -Version 5.0.0-alpha.2 
$ Install-Package Microsoft.EntityFrameworkCore.Design -Version 5.0.0
```

* ##### Step 3: Scaffold the database into the project
```bash
$ dotnet ef dbcontext scaffold "server='localhost';port=3306;user=root;password=password;database=dbname" Pomelo.EntityFrameworkCore.MySql -o outputdir -f
```

* ##### Step 4: Move connection string to the startup of the project
> Remove the content of onConfiguring in your DbContext class in the outputdir
> Add the following to your appsettings.json
```json
    "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;user=root;password=password;database=databasename"
    }
```
> Add the following using to your startup.cs
```C#
    using database context class;
    using Microsoft.EntityFrameworkCore;
    using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
```
> Add the following to the configureservices section
```C#
           // Replace "YourDbContext" with the name of your own DbContext derived class.
            services.AddDbContextPool<YourDbContext>(
                dbContextOptions => dbContextOptions
                    .UseMySql(
                        // Replace with your connection string.
                        Configuration.GetConnectionString("DefaultConnection"),
                        // Replace with your server version and type.
                        // For common usages, see pull request #1233.
                        new MySqlServerVersion(new Version(8, 0, 22)), 
                        mySqlOptions => mySqlOptions
                            .CharSetBehavior(CharSetBehavior.NeverAppend)));
```
* ##### Step 5: Use the context in your controller
> Add this to the controller / the controller constructor
```C#
        DBContextClass _context;

        public ScheduleController(DBContextClass context)
        {
            _context = context;
        }
```
> use _context to use the database.
