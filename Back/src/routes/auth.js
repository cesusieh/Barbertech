const express = require("express")
const router = express.Router()
const prisma = require("../prismaClient")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs") 

router.post("/", async (req, res) => {
  const { email, senha } = req.body

  try {
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" })

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" })

    const token = jwt.sign(
      { userId: user.id, papel: user.papel },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax'
    })

    res.json({ token })
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
