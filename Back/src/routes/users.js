const express = require("express")
const prisma = require("../prismaClient")
const bcrypt = require("bcryptjs")
const router = express.Router()

const { authenticateToken, authorizeRoles } = require("../middlewares/auth")

router.get("/", authenticateToken, authorizeRoles("GERENTE"), async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany()
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.get("/:id", authenticateToken,async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (req.user.papel != "Gerente") {
      if (req.user.userId !== id) {
        return res.status(403).json({ error: "Você só pode visualizar seu próprio usuário" })
      }
    }
    
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" })

    const usuario = await prisma.usuario.findUnique({ where: { id } })
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" })

    res.json(usuario)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

router.post("/", async (req, res) => {
  try {
    let { nome, senha, papel, email } = req.body

    const papelFormatado = papel.toUpperCase()

    const existingUser = await prisma.usuario.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: "Email já está em uso" })
    }

    const hashedPassword = await bcrypt.hash(senha, 10)

    const newUser = await prisma.usuario.create({
      data: { nome, senha: hashedPassword, papel: papelFormatado, email }
    })

    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (req.user.userId !== id) {
      return res.status(403).json({ error: "Você só pode alterar seu próprio usuário" })
    }

    if (req.body.senha) {
      req.body.senha = await bcrypt.hash(req.body.senha, 10)
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: req.body,
    })
    res.json(usuarioAtualizado)
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (req.user.userId !== id) {
      return res.status(403).json({ error: "Você só pode deletar seu próprio usuário" })
    }

    await prisma.usuario.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = router
