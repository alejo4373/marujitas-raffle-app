const pgp = require('pg-promise')();
const db = pgp('postgres://localhost:5432/colombiafest_users')
const utils = require('./utils');

const getAllUsers = async () => {
  let users;
  try {
    users = await db.any('SELECT * from users')
  } catch (err) {
    return utils.handleErr(err);
  }
  return users;
}

const putUser = async (user) => {
  const newUser = {
    registered_at: Date.now(),
    ...user
  }
  try {
    await db.none(
      `INSERT INTO users(name, lastname, email, phone, registered_at)
        VALUES($/name/, $/lastname/, $/email/, $/phone/, $/registered_at/);`,
      newUser
    )
    return 'SUCCESS';
  } catch (err) {
    if (err.routine === '_bt_check_unique') {
      return 'ALREADY_EXISTS';
    }
    return utils.handleErr(err);
  }
}

module.exports = {
  getAllUsers,
  putUser,
}



const main = async () => {
  let res = await putUser({
    name: 'blahblah2',
    lastname: 'Rodriguez',
    email: 'kelvinahdrodriakdguez@ac.c4q.nyc',
    phone: '917-5736025',
  })
  console.log(res);
}

main();