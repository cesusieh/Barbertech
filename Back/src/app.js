const express = require("express")
const app = express()

const userRouter = require("./routes/users")
const appointmentRouter = require("./routes/appointments")
const authRouter = require("./routes/auth")

app.use(express.json())
app.use("/users", userRouter)
app.use("/appointments", appointmentRouter)
app.use("/login", authRouter)

module.exports = app