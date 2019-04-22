const fromJSON = ({
  id, firstName, lastName, email, dateOfBirth, password,
}) => ({
  id,
  firstName,
  lastName,
  email,
  dateOfBirth,
  password,
});

const filterPrivateInfo = ({
  id, firstName, lastName, email, dateOfBirth,
}) => ({
  id,
  firstName,
  lastName,
  email,
  dateOfBirth,
});

module.exports = {
  fromJSON,
  filterPrivateInfo,
};
