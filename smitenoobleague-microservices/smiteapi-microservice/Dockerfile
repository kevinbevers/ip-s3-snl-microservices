#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY smiteapi-microservice/smiteapi-microservice.csproj smiteapi-microservice/
RUN dotnet restore "smiteapi-microservice/smiteapi-microservice.csproj"
COPY . .
WORKDIR "/src/smiteapi-microservice"
RUN dotnet build "smiteapi-microservice.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "smiteapi-microservice.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "smiteapi-microservice.dll"]
