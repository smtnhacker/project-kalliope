import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 8000
const HOST = process.env.HOST || 'localhost'

app.get("*", (req: Request, res: Response) => {
    res.send("API is up!")
})

app.listen(PORT, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
})