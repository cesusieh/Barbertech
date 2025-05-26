const express = require("express")
const router = express.Router()
const prisma = require("../prismaClient")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs") 

router.post("/login", async (req, res) => {
  const { email, senha } = req.body

  try {
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: "Usuário não encontrado" })

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if (!senhaValida) return res.status(401).json({ message: "Email ou senha incorretos" })

    const token = jwt.sign(
      { id: user.id, papel: user.papel },
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

router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id }, 
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
      }
    });

    if (!user) {
      return res.status(404).json({ isAuthenticated: false, message: 'Usuário não encontrado' });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(401).json({ isAuthenticated: false });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado com sucesso' });
});

module.exports = router
