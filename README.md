[![Codacy Badge](https://app.codacy.com/project/badge/Grade/23de5418d4e049c1bab35d91aedc7c3a)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=kevinbevers/ip-s3-snl-microservices&amp;utm_campaign=Badge_Grade)
![Front-end app](https://github.com/kevinbevers/ip-s3-snl-microservices/workflows/Front-end%20Node.js%20CI/badge.svg)
![Back-end services](https://github.com/kevinbevers/ip-s3-snl-microservices/workflows/Back-end%20.NET%20Core%20CI/badge.svg)

# IP S3 SNL microservices
# Smitenoobleague 
>Smitenoobleague is a website where teams can sign up, compete and see there stats.
> - The front-end is realized in ReactJS
> - The back-end is based on the microservices architecture using [ASP.NET Core] for the services.

### Tech

Smitenoobleague uses a number of open source projects and technologies to work properly:

* [ReactJS] - A JavaScript library for building user interfaces!
* [NextJS] - The react framework for production
* [React-Bootstrap] - The most popular front-end framework Rebuilt for React.
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Ocelot] - A modern fast, scalable API gateway built on [ASP.NET Core]
* [ASP.NET Core] - Free. Cross-platform. Open source. A framework for building web apps and services with .NET and C#.

### packages used in the web-app

The web-app uses the following *npm* / *yarn* packages

| Package | README |
| ------ | ------ |
| NextJS | [NextJS getting started][NextJSDoc] |
| React-bootstrap | [React-bootstrap README][React-bootstrapDoc] |
| Next-optimized-images | [Next optimized images README][NextOptDoc] |
| Next-compose-plugins | [Next compose plugins README][NextComDoc] |
| react-icons | [React icons plugins README][ReactIconDoc] |
| react-chartjs-2 | [React charts README][ReactChartDoc] |
| react-sortableJS | [Sortablejs page][SortableDoc]|
| Jest| [Jest docs][JestDoc]|
| Axios| [Axios docs][AxiosDoc]|
| Yarn| [Yarn page][YarnDoc]|


### Production
https://smitenoobleague.com
#### Development installation
Setup the required .env files

The smitenoobleague-microservices folder should have a .env containing the following:
```.env
DB_PASS={databasepass}
DevId={smiteapidevid}
AuthKey={smiteapiauthkey}
CertPass={sslcertpassword}
Domain={domainofthefrontend}
InternalServiceKey={generatedkeyusedforinternalcommuncationsecurity}
Auth0Domain={auth0domain}
Auth0Audience={auth0audience}
smtpMail={smtpmail}
smtpMailPass={smtpmailpass}
smtpHost={smtphost}
smtpHostPort={smtppass}
```
The smitenoobleague-web-app folder should have a .env containing the following:
```.env
AUTH0_LOGOUT_URL={frontenddomainlogouturl}
AUTH0_RETURN_URL={frontenddomainreturnurl}
AUTH0_AUDIENCE={auth0audience}
AUTH0_DOMAIN={auth0domain}
AUTH0_CLIENT_SECRET={auth0secret}
AUTH0_CLIENT_ID={auth0clientid}
COOKIE_SECRET={generatedcookiesecret}
NEXT_PUBLIC_BASE_API_URL={back-endapidomainurl}
```
##### Setting up the web-app
Open the project locally.
>cd the web-app directory in the terminal:
```bash
$ cd smitenoobleague-web-app
```
>then run the following commands to install all the required packages:
```bash
$ npm install --global yarn
$ yarn install

```
>Finally run the app:
```bash
$ yarn run dev
```
>finally go to [http//:localhost:3000][localhost] to see the web-app in the browser

##### Setting up the microservices back-end
Open the solution file(.sln)
>Visual studio will recognize the docker-compose.
>press the run button to run the docker compose.
* Docker desktop needs to be installed to run the back-end.

#### Questions?
Feel free to reach out to me if you want something cleared up or prehaps need help setting it all up.

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [ASP.NET Core]: <https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.1>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [ReactJS]: <https://reactjs.org/>
   [NextJS]: <https://nextjs.org/>
   [React-Bootstrap]: <https://react-bootstrap.github.io/>
   [Ocelot]: <https://threemammals.com/ocelot>
   [localhost]: <http://localhost:3000>

   [NextJSDoc]: <https://nextjs.org/docs/getting-started>
   [React-bootstrapDoc]: <https://github.com/react-bootstrap/react-bootstrap/blob/master/README.md>
   [NextOptDoc]: <https://github.com/cyrilwanner/next-optimized-images/blob/master/README.md>
   [NextComDoc]: <https://github.com/cyrilwanner/next-compose-plugins/blob/master/README.md>
   [ReactIconDoc]: <https://github.com/react-icons/react-icons/blob/master/README.md>
   [ReactChartDoc]: <https://github.com/jerairrest/react-chartjs-2/blob/master/README.md>
   [SortableDoc]: <https://github.com/SortableJS/react-sortablejs/blob/master/README.md/>
   [JestDoc]: <https://jestjs.io/>
   [AxiosDoc]: <https://github.com/axios/axios/blob/master/README.md>
   [YarnDoc]: <https://yarnpkg.com/>

