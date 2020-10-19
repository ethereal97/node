const { join } = require('path')
const PUBLIC_PATH = join(__dirname, 'public')


module.exports = function router(app) {
  //* index page
  app.get('/', (req, res) => {
    res.sendFile(join(PUBLIC_PATH, 'index.html'))
    res.end()
  })
  
  //* resources (favicon)
  app.get('/favicon.ico', (req, res) => {
    res.sendFile(join(PUBLIC_PATH, 'favicon.ico'))
    res.end()
  })
  
  //* resources (css)
  app.get('/css/:path', (req, res) => {
    res.sendFile(join(PUBLIC_PATH, 'css', req.params.path))
    res.end()
  })
  
  //* resources (js)
  app.get('/js/:path', (req, res) => {
    res.sendFile(join(PUBLIC_PATH, 'js', req.params.path))
    res.end()
  })
}