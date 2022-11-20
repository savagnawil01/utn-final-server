import db from '../database/db.js'
import { hashSync, compareSync } from 'bcrypt'

export async function signup (req, res, next) {
  try {
    const userExistsQuery = await db.query('SELECT * FROM users WHERE email = ?', [req.body.email])
    const userExists = userExistsQuery[0]
    if (userExists) {
      const err = new Error('CONFLICT: that email is already registered')
      err.code = 409
      throw err
    } else {
      const userToInsert = {
        name: req.body.name,
        email: req.body.email,
        password: hashSync(req.body.password, 10)
      }
      await db.query('INSERT INTO users SET ?', [userToInsert])
      return res.status(201).json({
        status: 201,
        message: 'CREATED'
      })
    }
  } catch (err) {
    next(err)
  }
}

export async function login (req, res, next) {
  try {
    const userToLogQuery = await db.query('SELECT * FROM users WHERE email = ?', [req.body.email])
    const userToLog = userToLogQuery[0]
    if (!userToLog) {
      const err = new Error("NOT FOUND: the email doesn't exist")
      err.code = 404
      throw err
    } else {
      const passwordsMatch = compareSync(req.body.password, userToLog.password)
      if (!passwordsMatch) {
        const err = new Error('CONFLICT: passwords do not match')
        err.code = 409
        throw err
      } else {
        console.log('lala')
      }
    }
  } catch (err) {
    next(err)
  }
}
