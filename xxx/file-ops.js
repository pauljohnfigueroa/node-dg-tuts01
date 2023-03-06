const fsPromises = require('fs').promises
const path = require('path')

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8')
    console.log(data)

    await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt')) // delete a file
    await fsPromises.writeFile(path.join(__dirname, 'files', 'promisesWrite.txt'), data)
    await fsPromises.appendFile(
      path.join(__dirname, 'files', 'promisesWrite.txt'),
      '\n\nNice to meet you.'
    )
    await fsPromises.rename(
      path.join(__dirname, 'files', 'promisesWrite.txt'),
      path.join(__dirname, 'files', 'promisesComplete.txt')
    )

    const newData = await fsPromises.readFile(
      path.join(__dirname, 'files', 'promisesComplete.txt'),
      'utf8'
    )
    console.log(newData)
  } catch (err) {
    console.error(err)
  }
}

fileOps()

// fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf-8', (err, data) => {
//   if (err) throw err
//   console.log(data)
// })

// console.log('Hello...')

// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you.', err => {
//   if (err) throw err
//   console.log('Write Complete.')
// })

// fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), 'Appended another line.', err => {
//   if (err) throw err
//   console.log('Append Complete.')
// })
