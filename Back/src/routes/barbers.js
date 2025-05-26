const express = require("express")
const router = express.Router()
const prisma = require("../prismaClient")
const bcrypt = require("bcryptjs")

router.get("/barbers", async(req, res) => {
  try {
    const barbeiros = await prisma.usuario.findMany({where: {papel:"BARBEIRO"}, select:{id:true, nome:true, email:true} })
    res.json(barbeiros)
  } catch (error) {
    res.status(500).json( { error })
  }
})

router.put("/barbers/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  try {
    const dadosAtualizacao = {};
    if (nome) dadosAtualizacao.nome = nome;
    if (email) dadosAtualizacao.email = email;
    if (senha) dadosAtualizacao.senha = await bcrypt.hash(senha, 10)

    const barbeiroAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dadosAtualizacao,
      select: { id: true, nome: true, email: true }
    });

    res.json(barbeiroAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar barbeiro' });
  }
});


module.exports = router