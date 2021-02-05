#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base

RUN apt-get update && apt-get -y install libxml2 libgdiplus libc6-dev

WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY . news-microservice/
RUN dotnet restore "news-microservice/news-microservice.csproj"
COPY . .
WORKDIR "/src/news-microservice"
RUN dotnet build "news-microservice.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "news-microservice.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "news-microservice.dll"]
