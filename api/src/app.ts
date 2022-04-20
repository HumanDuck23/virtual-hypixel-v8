const express = require("express")
const app = express()

const PORT = 4505

app.use(function (req: any, res: any, next: any) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()
})

app.get("/latest", (req: any, res: any) => {
    res.sendFile(__dirname + "/latest.json")
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})