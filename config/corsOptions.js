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

module.exports = corsOptions
