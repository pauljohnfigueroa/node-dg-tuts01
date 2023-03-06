const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const PORT = process.env.PORT || 3500

// middlewares
// our custom logger middleware
app.use(logger)
// Cross Origin Resource Sharing
// you must have a shitelist of allowed domains
const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
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

app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
