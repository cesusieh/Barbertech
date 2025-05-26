const express = require("express")
const router = express.Router()
const prisma = require("../prismaClient")

router.get("/barbeiros", async(req, res) => {
  try {
    const barbeiros = await prisma.usuario.findMany({where: {papel:"BARBEIRO"}, select:{id:true, nome:true, email:true} })
    res.json(barbeiros)
  } catch (error) {
    res.status(500).json( { error })
  }
})

module.exports = router