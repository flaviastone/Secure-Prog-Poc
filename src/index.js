/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const studentUtil = require('./studentUtil');
const studentStore = require('./studentStore');

const handleError = (res, err) => {
  console.error(err);
  res.json({ error: err.message });
};

const app = express();
app.use(bodyParser.json());
app.use((_, res, next) => {
  res.setHeader('cache-control', 'private, max-age=0, no-cache, no-store, must-revalidate');
  res.setHeader('expires', '0');
  res.setHeader('pragma', 'no-cache');
  next();
});

app.get('/students', async (_, res) => {
  try {
    const students = await studentStore.list();
    res.json(students.map(studentUtil.filterPrivateInfo));
  } catch (err) {
    console.error('Could not list Students', err);
  }
});

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

app.post('/students', async (req, res) => {
  try {
    const student = await studentStore.store(studentUtil.fromJSON(req.body));
    res.json(studentUtil.filterPrivateInfo(student));
  } catch (err) {
    console.error('Could not create Student', err);
  }
});

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

studentStore.store(studentUtil.fromJSON({
  id: '20081102',
  firstName: 'Hubert',
  lastName: 'Stefanski',
  email: '20081102@mail.wit.ie',
  dateOfBirth: '1998-11-09',
  password: 'passworddrowssap',
}));
studentStore.store(studentUtil.fromJSON({
  id: '20081103',
  firstName: 'Adam',
  lastName: 'Walshe',
  email: '20081103@mail.wit.ie',
  dateOfBirth: '1990-10-29',
  password: 'passworddrowssap12345654321',
}));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
