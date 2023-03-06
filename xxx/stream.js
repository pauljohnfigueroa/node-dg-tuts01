const fs = require('fs')
const rs = fs.createReadStream('./files/lorem.txt', { encoding: 'utf8' })
const ws = fs.createWriteStream('./files/new-lorem.txt')

// listen to incoming data
// rs.on('data', dataChunk => {
//   ws.write(dataChunk)
// })

// better alternative
rs.pipe(ws)
