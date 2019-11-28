
//****without express.js code to create server */
/* const http = require('http');

const server = http.createServer();

server.on('request',(request,response)=>{
   response.writeHead(200,{'Content-Type':'text/plain'});
   response.write('Hello world');
   response.end();
});

server.listen(3000,()=>{
  console.log('Node server created at port 3000');
}); */


//with express.js to create server
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
mongoose.connect('mongodb://localhost:27017/myfirstmongodb', {useNewUrlParser: true,useUnifiedTopology:true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



const Student = mongoose.model('Student', {
    name: String,
    student_id: Number,
    email: String,
    password: String,
    date_added: Date
   });




app.get('/', (req, res) => {         //if we put'*' over here it will redirect to helloworld on every url     
  res.send('welcome to my first node.js app');
});

app.post('/signup', async (req, res) => {
    const body = req.body;
    console.log('req.body', body)
      try{
    const student = new Student(body);
    
    const result = await student.save();
    res.send({
      message: 'Student signup successful'
    });
    
      }
      catch(ex){
        console.log('ex',ex);
        res.send({message: 'Error'}).status(401);
      }
});

app.get('/students', async (req, res) => {

  const allStudents = await Student.find();
  console.log('allStudents', allStudents);

  res.send(allStudents);
});
/* 
app.get('/students', (req,res)=> {
   //res.send("hello students,how are you doing");
    const listofstudents = [
        {id:1 , name:'ali'},
        {id:2 , name:'waqas'},
        {id:3 , name:'adil'},
    ]
    res.send(listofstudents);
}); */

app.post('/login',  async (req, res) => {
  const body = req.body;
  console.log('req.body', body);

  const email = body.email;

  // lets check if email exists

  const result = await Student.findOne({"email":  email});
  if(!result) // this means result is null
  {
    res.status(401).send({
      Error: 'This user doesnot exists. Please signup first'
     });
  }
  else{
    if(body.password === result.password){
      console.log('match');
      res.send({message: 'successfully logged in'});
    }
    else{
      console.log('passwod doesnot match');
      res.status(401).send({message: 'wrong email or password!correct it'});
    }
  }
});

app.get('*',(req,res)=>{
    res.send("Page does'nt exist!");
});

app.listen(3000, () => {
  console.log('Express application running on localhost:3000');
});
