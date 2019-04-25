const fromJSON = ({
  id, studentNumber, firstName, lastName, email, dateOfBirth, password,
}) => ({
  id,
  studentNumber,
  firstName,
  lastName,
  email,
  dateOfBirth,
  password,
});

const filterPrivateInfo = ({
  id, studentNumber, firstName, lastName, email, dateOfBirth,
}) => ({
  id,
  studentNumber,
  firstName,
  lastName,
  email,
  dateOfBirth,
});

module.exports = {
  fromJSON,
  filterPrivateInfo,
};
