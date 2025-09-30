const http = require("http")

const users = [
  {
    id: 1,
    name: "Ismail Abdifadil",
    className: "CA226",
  },
  {
    id: 2,
    name: "Mohamed Ali Omar",
    className: "CA221",
  },
  {
    id: 3,
    name: "Sadak Macalin",
    className: "CA221",
  },
]

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    return res.end(
      JSON.stringify({ success: true, message: "Welcome to the server" })
    )
  } else if (req.url === "/api/users" && req.method === "GET") {
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    return res.end(JSON.stringify(users))
  } else if (
    req.url.match(/^\/api\/users\/([0-9]+)$/) &&
    req.method === "GET"
  ) {
    const id = req.url.match(/^\/api\/users\/([0-9]+)$/)[1]
    const user = users.find((user) => user.id.toString() === id)

    if (!user) {
      res.statusCode = 404
      res.setHeader("Content-Type", "application/json")
      return res.end(
        JSON.stringify({ success: false, message: "User not found." })
      )
    }
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    return res.end(JSON.stringify({ success: true, data: user }))
  } else if (req.url === "/api/users" && req.method === "POST") {
    let body = []

    req
      .on("data", (chunk) => {
        body.push(chunk)
      })
      .on("end", () => {
        body = Buffer.concat(body).toString()
        const cleanedBody = JSON.parse(body)
        const { id, name, className } = cleanedBody

        if (!id || !name || !className) {
          res.setHeader("Content-Type", "application/json")
          return res.end(
            JSON.stringify({
              success: false,
              message: "Please, fill all the fields. [id, name, and className]",
            })
          )
        }

        users.push(cleanedBody)
        res.setHeader("Content-Type", "application/json")
        return res.end(JSON.stringify(users))
      })
  } else if (
    req.url.match(/^\/api\/users\/([0-9]+)$/) &&
    req.method === "PUT"
  ) {
    const id = req.url.match(/^\/api\/users\/([0-9]+)$/)[1]
    let body = []

    req
      .on("data", (chunk) => {
        body.push(chunk)
      })
      .on("end", () => {
        body = Buffer.concat(body).toString()
        const cleanedBody = JSON.parse(body)

        const user = users.find((user) => user.id.toString() === id)

        if (!user) {
          res.statusCode = 404
          res.setHeader("Content-Type", "application/json")
          return res.end(
            JSON.stringify({ success: false, message: "User does not exist." })
          )
        }

        user.name = cleanedBody.name || user.name
        user.className = cleanedBody.className || user.className

        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        return res.end(
          JSON.stringify({ success: true, message: "User updated", data: user })
        )
      })
  }
})

const PORT = 5000

server.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
