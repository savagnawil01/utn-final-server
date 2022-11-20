import express from 'express'
import * as dotenv from 'dotenv'
import authRouter from './routes/auth.routes.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRouter)

app.use((err, req, res, next) => {
  if (Object.hasOwn(err, 'sqlMessage')) {
    err.code = 500
    err.message = err.sqlMessage
  } else if (err.code === 'ER_DUP_ENTRY') {
    err.code = 500
    err.message = 'MySQL duplicated entry error'
  } else if (!err.code) {
    err.code = 500
  }

  return res.status(err.code).json({
    status: err.code,
    error: err.message
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running @ ${PORT}`))
