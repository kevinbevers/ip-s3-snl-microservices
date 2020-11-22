const express = require('express');
const app = express();
app.use(express.json()); //add post middleware
const schedule = require('node-schedule');
const http = require('http');
 //export TZ=UTC
 //export PORT=5003

//should make a call to smiteapi api to get scheduled matchIDS from the database. 
//save the scheduled tasks data to make sure they can be retrieved when node app restarts
  http.get('http://localhost:5000/smiteapi/queuedmatch', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data));
    let scheduledGames = JSON.parse(data);

    scheduledGames.forEach(game => {

      const id = game.gameID;
      const date = new Date(game.scheduleTime);

      //still something wrong with this date sorting.
      if(Date.parse(date) <= Date.now())
      {
        console.log("Ran catch up job.. " + "id: " + id + " @: " + date);
        //make api call to get matchdata. in that call it will also update the database
      }
      else {
        console.log("Added " + id + " as scheduled job @: " + date );
        ScheduleGame(date, id);
      }
    });

  });

}).on("error", (err) => {
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
 
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`));

function ScheduleGame(date, id) {
  schedule.scheduleJob(date, function () {
    console.log("scheduled job ran.. " + "id: " + id + " @: " + date);
  });
}
