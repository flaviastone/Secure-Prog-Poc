/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const mysql = require('mysql');
const LocalStrategy = require('passport-local').Strategy;
const studentUtil = require('./studentUtil');
const studentStore = require('./studentStore');

// error handling
const handleError = (res, err) => {
  console.error(err);
  res.json({ error: err.message });
};
// admin login used for authenticating and receiving tokens
const ADMIN = 'root';
const ADMIN_PASSWORD = 'toor';
const port = '3000';

// create mysql connection to database
const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
  database: 'students',
});

database.connect((err) => {
  if (err) throw err;
});
database.on('error', (err) => {
  console.log('[mysql error]', err);
});


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs', 'ejs');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((_, res, next) => {
  res.setHeader('cache-control', 'private, max-age=0, no-cache, no-store, must-revalidate');
  res.setHeader('expires', '0');
  res.setHeader('pragma', 'no-cache');
  next();
});
// draws the index page
app.get('/index', (_req, res) => {
  const myTitle = 'Index';
  res.render('index', { title: myTitle });
});

// credential check for root user
passport.use(new LocalStrategy((username, password, done) => {
  if (username === ADMIN && password === ADMIN_PASSWORD) {
    done(null, 'TOKEN');
    return;
  }
  done(null, false);
}));
// credential check returning login token for current session
app.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.send({
      token: req.user,
    });
  },
);
// list returning all students in the database minus their sensitive information
app.get('/students', async (req, res) => {
  try {
    const students = await studentStore.list();
    res.json(students.map(studentUtil.filterPrivateInfo));
  } catch (err) {
    console.error('Could not list Students', err);
  }
});
// search by id function for any student
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentStore.get(id);
    if (!student) {
      handleError(res.status(404), new Error(`Could not get Student with ID ${id}`));
      return;
    }
    res.json(studentUtil.filterPrivateInfo(student));
  } catch (err) {
    console.error('Could not retrieve Student', err);
  }
});
// add new students to database
app.post('/students', async (req, res) => {
  const student = await studentStore.store(studentUtil.fromJSON(req.body));
  const { firstName } = req.firstName;
  const { lastName } = req.lastName;
  const { studentNumber } = req.studentNumber;
  const { email } = req.email;
  res.render('students', {
    title: 'Students', firstName, lastName, studentNumber, email,
  });

  try {
    res.json(studentUtil.filterPrivateInfo(student));
  } catch (err) {
    console.error('Could not create Student', err);
  }
});

// remove student by their student id
// eslint-disable-next-line no-shadow
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentStore.remove(id);
    if (!student) {
      handleError(res.status(404), new Error(`Could not delete Student with ID ${id}`));
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('An error occurred trying to delete a Student', err);
  }
});
// search query for the database
app.get('/lookup', (_req, res) => {
  const myTitle = 'lookup';
  res.render('lookup', { title: myTitle });
  app.post('/lookup', (req, res) => {
    const { firstName } = req.body.firstName;
    // const { password } = req.body.password;
    database.query(`SELECT * FROM students WHERE firstName = '${firstName}'`, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  });
});
// default entries for the database
studentStore.store(studentUtil.fromJSON({
  id: '20081102',
  studentNumber: '20081102',
  firstName: 'Hubert',
  lastName: 'Stefanski',
  email: '20081102@mail.wit.ie',
  dateOfBirth: '1998-11-09',
  password: 'passworddrowssap',
}));
studentStore.store(studentUtil.fromJSON({
  id: '20081103',
  studentNumber: '20081103',
  firstName: 'Adam',
  lastName: 'Walshe',
  email: '20081103@mail.wit.ie',
  dateOfBirth: '1990-10-29',
  password: 'passworddrowssap12345654321',
}));
// eslint-disable-next-line no-template-curly-in-string
app.listen(port, () => console.log(`Example app listening on port : ${port}`));
