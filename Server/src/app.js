import express from "express";
import cors from "cors";

const app = express()

app.use(cors())
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

//User Routes
import userRouter from  "./routes/user.routes.js"
app.use("/api/user", userRouter)

//Team Routes
import teamRouter from "./routes/team.routes.js"
app.use("/api/team", teamRouter)


//Home Route
app.get("/", (req, res) => {
    res.send("Hello World")
})


export {app} 