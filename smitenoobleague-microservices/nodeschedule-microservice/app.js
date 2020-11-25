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

//should make a call to smiteapi api to get scheduled matchIDS from the database. 
//save the scheduled tasks data to make sure they can be retrieved when node app restarts
axios.get(process.env.API_URL + '/queuedmatch')
.then(res =>
// The whole response has been received. Print out the result.
{
  console.log(JSON.parse(data));
  let scheduledGames = JSON.parse(data);
  //foreach received object
  scheduledGames.forEach(game => {

    const id = game.gameID;
    const date = new Date(game.scheduleTime);
    //still something wrong with this date sorting.
    if (Date.parse(date) <= Date.now()) {
      console.log("Ran catch up job.. " + "id: " + id + " @: " + date);
      //make api call to get matchdata. in that call it will also update the database
    }
    else {
      console.log("Added " + id + " as scheduled job @: " + date);
      ScheduleGame(date, id);
    }
  });
})
  .catch(err => {
    console.log("Error: " + err.message);
  });

app.get('/', function (req, res) {
  res.send('Node scheduler is running')
});

//post version
app.post('/schedulematch', function (req, res) {

  var date = new Date(req.body.time);
   
  var j = schedule.scheduleJob(date, function(){
    console.log('Scheduled job ran.');
  });

  res.send(`Game with ID: ${req.body.id} added to scheduling. Date: ${req.body.time}`);
});

//get version of scheduling expected: /schedulematch/1111111111/year-month-dayT00:00:00 //this get's called by the smite api 
//date should be in the future.
app.get('/schedulematch/:id/:time', function (req, res) {

  const date = new Date(req.params.time);
  const id = req.params.id;
  console.log(date);
  
  ScheduleGame(date, id);
  
  res.send(`Game with ID: ${id} added to scheduling. Date: ${date}`);
});
 
//App listen
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`));

//Methods / functions
function ScheduleGame(date, id) {
  schedule.scheduleJob(date, function () {

    //send the gameID to the smiteapi microservice
    axios.post(process.env.API_URL + '/queuedmatch', {
      gameID: id,
      teamID: 0
      
    })  
    .then(res => {
      //log the response
      console.log("scheduled job ran successfull with the following data: {" + "id: " + id + " @: " + date + "}");
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res);
    })
    .catch(error => {
      //log the error
      console.log("scheduled job ran unsuccessfull with the following data: {" + "id: " + id + " @: " + date + "}");
      console.error(error);

      //reschedule with + 2 hours
      date = date.addHours(2);
      ScheduleGame(date, id);
    })
  });
}
//extension for Date object
Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}
