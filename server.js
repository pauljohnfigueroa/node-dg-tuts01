const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 3500
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')

// middlewares
// our custom logger middleware
app.use(logger)

// handle options credentials
app.use(credentials)

// Cross Origin Resource Sharing
// you must have a whitelist of allowed domains, see config/corsOptions
app.use(cors(corsOptions))

// built-in middleware to handle url encoded data, or meaning form data
app.use(express.urlencoded({ extended: false }))
// json middleware
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// server static files
app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT) // everything after this line will use the verifyJWT middleware
app.use('/employees', require('./routes/api/employees'))

// default route
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 file not found.' })
  } else {
    res.type('txt').send('404 file not found.')
  }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
