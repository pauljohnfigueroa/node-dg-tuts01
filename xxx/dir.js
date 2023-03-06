const fs = require('fs')

// check if file exists
if (!fs.existsSync('./new')) {
  fs.mkdir('./new', err => {
    if (err) throw err
    console.log('Directory created.')
  })
}

// check if file exists
if (fs.existsSync('./new')) {
  fs.rmdir('./new', err => {
    if (err) throw err
    console.log('Directory deleted.')
  })
}
