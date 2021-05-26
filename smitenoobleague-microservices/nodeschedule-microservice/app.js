//express for api
const express = require('express');
const app = express();
app.use(express.json());
//env variables
const dotenv = require('dotenv');
dotenv.config(); //add post middleware

//schedule job
const schedule = require('node-schedule');
//make api calls with axios
const axios = require('axios');
//export TZ=UTC
//export PORT=5003

app.get('/', function (req, res) {
  res.send('Node scheduler is running')
});

//post version
app.post('/schedulematch', async function (req, res) {

  const date = new Date(req.body.time);
  const id = req.body.id;
  const patch = req.body.patch;

  ScheduleGame(date, patch, id);
  console.log(`Game with ID: ${id} added to scheduling. Date: ${date}`);
  res.send(`Game with ID: ${id} added to scheduling. Date: ${date}`);
});

//get version of scheduling expected: /schedulematch/1111111111/year-month-dayT00:00:00 //this get's called by the smite api 
//date should be in the future.
app.get('/schedulematch/:id/:patch/:time', async function (req, res) {

  const date = new Date(req.params.time);
  const id = req.params.id;
  const patch = req.params.patch;

  ScheduleGame(date, patch, id);
  console.log(`Game with ID: ${id} added to scheduling. Date: ${date}`);
  res.send(`Game with ID: ${id} added to scheduling. Date: ${date}`);
});

//get version of scheduling expected: /schedulematch/1111111111/year-month-dayT00:00:00 //this get's called by the smite api 
//date should be in the future.
app.get('/scheduleinhousematch/:id/:patch/:time', async function (req, res) {

  const date = new Date(req.params.time);
  const id = req.params.id;
  const patch = req.params.patch;

  CallSmiteApiInhouse(date, patch, id);
  console.log(`Inhouse Game with ID: ${id} added to scheduling. Date: ${date}`);
  res.send(`Inhouse Game with ID: ${id} added to scheduling. Date: ${date}`);
});

//App listen
const port = process.env.PORT || 3001;
app.listen(port, async() => {
  console.log(`Listening on port: ${port}`); 
  //INIT. get all scheduled jobs from the database. to prevent schedule loss on restart of node app
  await GetJobsFromDB();
  await GetInhouseJobsFromDB();
});

//Methods / functions
async function ScheduleGame(date, patch, id) {
  schedule.scheduleJob(date, function () {
    //send the gameID to the smiteapi microservice
    CallSmiteApi(id, patch, date);
  });
}

//Methods / functions
function ScheduleInhouseGame(date, patch, id) {
  schedule.scheduleJob(date, async function () {
    //send the gameID to the smiteapi microservice
    CallSmiteApiInhouse(id, patch, date);
  });
}

function CallSmiteApi(id, patch, date) {
  axios.post(process.env.API_URL + '/queuedmatch', {
    gameID: id,
    patchNumber: patch
  },{headers: {"ServiceKey":process.env.InternalServiceKey}})
    .then(res => {
      //log the response
      console.log("scheduled job ran successfull with the following data: {" + "id: " + id + " @: " + date + "}");
      console.log(`statusCode: ${res.status}`);
    })
    .catch(error => {
      //log the error
      console.log("scheduled job ran unsuccessfull with the following data: {" + "id: " + id + " @: " + date + "}");
      //Log the response text
      if(error?.response?.status == 404 || error?.response?.status == 500)
      {
      console.log("scheduled for retry in 1 hour.")
      //reschedule with + 1 hours
      date = Date.now();
      date += (1 * 60 * 60 * 1000);
      ScheduleGame(date, patch, id);
      }
    });
}

function CallSmiteApiInhouse(id, patch, date) {
  axios.post(process.env.API_URL + '/queuedmatch/inhouse', {
    gameID: id,
    patchNumber: patch
  },{headers: {"ServiceKey":process.env.InternalServiceKey}})
    .then(res => {
      //log the response
      console.log("Inhouse scheduled job ran successfull with the following data: {" + "id: " + id + " @: " + date + "}");
      console.log(`statusCode: ${res?.response?.statusCode}`);
      //console.log(res?.response?.data);
    })
    .catch(error => {
      //log the error
      console.log("Inhouse scheduled job ran unsuccessfull with the following data: {" + "id: " + id + " @: " + date + "}");
      //Log the response text
      console.error(error.response.data);

      //reschedule with + 2 hours
      date = Date.now();
      date += (1 * 60 * 60 * 1000);
      ScheduleInhouseGame(date, patch, id);
    }).catch(error => { console.error(error); });
}

async function GetJobsFromDB() {
  await axios.get(process.env.API_URL + '/queuedmatch',{headers: {"ServiceKey":process.env.InternalServiceKey}})
    .then(res =>
    // The whole response has been received. Print out the result.
    {
      const data = res.data;
      console.log(data);
      let scheduledGames = data;
      //foreach received object
      await asyncForEach(scheduledGames, async(game) => {
        const id = game.gameID;
        const date = new Date(game.scheduleTime);
        const patch = game.patchNumber;
        //still something wrong with this date sorting.
        if (Date.parse(date) <= Date.now()) {
          console.log("Ran catch up job.. " + "id: " + id + " @: " + Date.now());
          //make api call to get matchdata. in that call it will also update the database
          await sleep(6000);
          CallSmiteApi(id, patch, date);
        }
        else {
          console.log("Added " + id + " as scheduled job @: " + date);
          ScheduleGame(date, patch, id);
        }
      });
    })
    .catch(err => {
      console.log("Error: " + err);
        setTimeout(GetJobsFromDB, 5000);
    });
}

async function GetInhouseJobsFromDB() {
  await axios.get(process.env.API_URL + '/queuedmatch/inhouse',{headers: {"ServiceKey":process.env.InternalServiceKey}})
    .then(res =>
    // The whole response has been received. Print out the result.
    {
      const data = res.data;
      console.log(data);
      let scheduledGames = data;
      //foreach received object
      await asyncForEach(scheduledGames, async(game) => {
        const id = game.gameID;
        const date = new Date(game.scheduleTime);
        const patch = game.patchNumber;
        //still something wrong with this date sorting.
        if (Date.parse(date) <= Date.now()) {
          console.log("Ran catch up job.. " + "id: " + id + " @: " + Date.now());
          //make api call to get matchdata. in that call it will also update the database
          await sleep(6000);
          CallSmiteApiInhouse(id, patch, date);
        }
        else {
          console.log("Added " + id + " as scheduled job @: " + date);
          ScheduleInhouseGame(date, patch, id);
        }
      });
    })
    .catch(err => {
      console.log("Error: " + err);
        setTimeout(GetInhouseJobsFromDB, 5000);
    });
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}