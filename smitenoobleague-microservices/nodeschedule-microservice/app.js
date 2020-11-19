const express = require('express');
const app = express();
app.use(express.json()); //add post middleware
const schedule = require('node-schedule');
 

//should make a call to smiteapi api to get scheduled matchIDS from the database. 
//save the scheduled tasks data to make sure they can be retrieved when node app restarts

app.get('/', function (req, res) {
  res.send('Node scheduler is running')
})

//post version
app.post('/schedulematch', function (req, res) {

  var date = new Date(req.body.time);
   
  var j = schedule.scheduleJob(date, function(){
    console.log('Scheduled job ran.');
  });

  res.send(`Game with ID: ${req.body.id} added to scheduling. Date: ${req.body.time}`)
})

//get version of scheduling expected: /schedulematch/1111111111/year-month-dayT00:00:00 //this get's called by the smite api 
//date should be in the future.
app.get('/schedulematch/:id/:time', function (req, res) {

  const date = new Date(req.params.time);
  const id = req.params.id;
  console.log(date);
  
  schedule.scheduleJob(date, function(){ 
    console.log("scheduled job ran.. " + "id: " + id + " @:" +  date);
    //call smiteapi to retrieve match data and store it. expect return value with status: successfull / failed. and a new scheduled time to run
  });
  
  res.send(`Game with ID: ${id} added to scheduling. Date: ${date}`)
})
 
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`));