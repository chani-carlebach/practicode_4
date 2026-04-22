# שלב 1: בניית האפליקציה (Build)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# העתקת קובץ הפרויקט ושחזור חבילות
COPY ["TodoApi.csproj", "./"]
RUN dotnet restore "TodoApi.csproj"

# העתקת כל שאר הקבצים ובנייה
COPY . .
RUN dotnet publish "TodoApi.csproj" -c Release -o /app/publish

# שלב 2: הרצה (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# חשיפת הפורט שהאפליקציה משתמשת בו
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TodoApi.dll"]