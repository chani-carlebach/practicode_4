# שלב 1: בניית האפליקציה (Build)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# העתקה של קובץ הפרויקט - שימי לב לשם המדויק!
COPY ["TodoApi.csproj", "./"]
RUN dotnet restore "TodoApi.csproj"

# העתקת שאר הקבצים ובנייה
COPY . .
RUN dotnet build "TodoApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TodoApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# שלב 2: הרצה (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "TodoApi.dll"]