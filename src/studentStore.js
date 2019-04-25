const students = {};

/**
 * Retrieve a Student from the in-memory store by it's ID.
 *
 * @param {Number} id The Student ID to retrieve.
 * @returns {Promise<Student>}
 */
async function get(id) {
  return new Promise((resolve) => {
    resolve(students[id]);
  });
}

/**
 * Retrieve all Students in the in-memory store.
 *
 * @returns {Promise<Student[]>}
 */
async function list() {
  return new Promise((resolve) => {
    resolve(Object.values(students));
  });
}

/**
 * Persist a Student to the in-memory store.
 *
 * @param {Student} student The student to store.
 * @returns {Promise<Student>}
 */
async function store(student) {
  return new Promise((resolve) => {
    students[student.id] = student;
    resolve(student);
  });
}

/**
 * Delete a Student from the in-memory store by it's ID.
 *
 * @param {Number} id The Student ID to delete.
 * @returns {Promise<Student>}
 */
async function remove(id) {
  return new Promise((resolve) => {
    const toDelete = students[id];
    if (!toDelete) {
      // This could be `return resolve();` either.
      resolve();
      return;
    }
    delete students[toDelete.id];
    resolve(toDelete);
  });
}

module.exports = {
  get,
  list,
  store,
  remove,
};
