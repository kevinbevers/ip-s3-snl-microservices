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

### npm packages used in the web-app

The web-app uses the following *npm* packages

| Package | README |
| ------ | ------ |
| NextJS | [NextJS getting started][NextJSDoc] |
| React-bootstrap | [React-bootstrap README][React-bootstrapDoc] |
| Next-optimized-images | [Next optimized images README][NextOptDoc] |
| Next-compose-plugins | [Next compose plugins README][NextComDoc] |
| react-icons | [React icons plugins README][ReactIconDoc] |
| react-chartjs-2 | [React charts README][ReactChartDoc] |
| SWR | [SWR page][SWRDoc]|
| Jest| [Jest docs][JestDoc]|


### Release installation
project not ready for release.
#### Development installation

##### Setting up the web-app
Open the project locally.
>cd the web-app directory in the terminal:
```bash
$ cd smitenoobleague-web-app
```
>then run the following commands to install all the required packages:
```bash
$ npm i npm install next react react-dom
$ npm install react-bootstrap bootstrap
$ npm install next-optimized-images@canary
$ npm install --save next-compose-plugins
$ npm install react-icons --save
$ npm install --save react-chartjs-2 chart.js
$ npm install swr
$ npm add --dev babel-jest @babel/core @babel/preset-env
$ npm add -D jest jest-dom @testing-library/react @testing-library/jest-dom @testing-library/dom babel-jest
```
>Finally run the app:
```bash
$ npm run dev
```
>finally go to [http:localhost:3000][localhost] to see the web-app in the browser


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
   [SWRDoc]: <https://swr.vercel.app/>
   [JestDoc]: <https://jestjs.io/>

