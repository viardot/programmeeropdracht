const http = require('http')
const fs = require('fs')


http.createServer((req, res) => {

    const filename = './home.html'
    
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) throw err

        console.log(data)
        res.writeHeader(200, {'Conent-Type': 'text/html'})
        res.write(data, 'utf8')
        res.end()
    })

}).listen(4000)