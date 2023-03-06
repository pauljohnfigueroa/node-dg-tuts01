const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500

// middlewares
// our custom logger middleware
app.use(logger)
// Cross Origin Resource Sharing
// you must have a shitelist of allowed domains
const whitelist = ['https://www.google.com', 'http://localhost:3500/']
const corsOptions = {
  origin: (origin, callback) => {
    // remove || !origin in production
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// built-in middleware to handle url encoded data, or meaning form data
app.use(express.urlencoded({ extended: false }))
// json middleware
app.use(express.json())
// server static files
app.use(express.static(path.join(__dirname, '/public')))

app.get('^/$|/index(.html)?', (req, res) => {
  //res.send('Hello world.')
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, 'new-page.html')
})

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
