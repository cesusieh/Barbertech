const express = require("express")
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const userRouter = require("./routes/users")
const appointmentRouter = require("./routes/appointments")
const authRouter = require("./routes/auth")
const barberRouter = require("./routes/barbers")

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true }));
app.use(cookieParser())

app.use("/users", userRouter)
app.use("/appointments", appointmentRouter)
app.use("/", authRouter)
app.use("/", barberRouter)

module.exports = app