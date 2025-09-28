const http = require("http")

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ success: true, message: "Welcome to the server" }))
})

const PORT = 5000

server.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
