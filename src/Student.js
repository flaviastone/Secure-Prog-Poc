const DELAY = 1000;
const studentById = {
  20081102: {
    id: '20081102',
    studentNumber: '20081102',
    firstName: 'Hubert',
    lastName: 'Stefanski',
    email: '20081102@mail.wit.ie',
    dateOfBirth: '1998-11-09',
    password: 'passworddrowssap',
  },
  20081103: {
    id: '20081103',
    studentNumber: '20081103',
    firstName: 'Adam',
    lastName: 'Walshe',
    email: '20081103@mail.wit.ie',
    dateOfBirth: '1990-10-29',
    password: 'passworddrowssap12345654321',
  },

};

const studentIds = [
  '20081102',
  '20081103',
];

const Student = ({
  id, studentNumber, firstName, lastName, email, dateOfBirth, password,
}) => ({
  id,
  studentNumber,
  firstName,
  lastName,
  email,
  dateOfBirth,
  password,
  destroy() {
    return new Promise((resolve) => {
      delete studentById[this.id];
      studentIds.splice(studentIds.indexOf(this.id), 1);
      resolve();
    }, DELAY);
  },
});
module.exports = {
  create({
    studentNumber,
    firstName,
    lastName,
    email,
    dateOfBirth,
    password,
  }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = Date.now().toString();
        studentById[id] = {
          id,
          studentNumber,
          firstName,
          lastName,
          email,
          dateOfBirth,
          password,
        };
        studentIds.push(id);
        resolve(Student(studentById[id]));
      }, DELAY);
    });
  },
  findAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(studentIds.map(id => Student(studentById[id])));
      }, DELAY);
    });
  },
  findById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Student(studentById[id]));
      }, DELAY);
    });
  },
};
