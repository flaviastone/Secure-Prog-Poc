/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const Student = require('./Student');

const app = express();
app.use(bodyParser.json);
app.use((req, res, next) => {
  res.setHeader('cache-control', 'private, max-age=0, no-cache, no-store, must-revalidate');
  res.setHeader('expires', '0');
  res.setHeader('pragma', 'no-cache');
  next();
});
app.get('/students', (_, res) => {
  Student.findAll().then((students) => {
    res.send(students);
  });
});
app.post('/students', (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    password: req.body.password,
  }).then((student) => {
    res.send(student);
  });
});
app.delete('/students/:id', (req, res) => {
  Student.findById(req.params.id)
    .then(student => student.destroy())
    .then(() => res.send());
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));
