const express = require("express")
const prisma = require("../prismaClient")
const { authenticateToken, authorizeRoles } = require("../middlewares/auth")
const router = express.Router()

router.get("/", authenticateToken, authorizeRoles("USUARIO", "GERENTE", "BARBEIRO"), async (req, res) => {
  try {
    const { id, papel } = req.user;

    let where = {};

    if (papel === "USUARIO") {
      where = { clienteId: id };
    } else if (papel === "BARBEIRO") {
      where = { barbeiroId: id };
    }
   
    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: { cliente: true, barbeiro: true },
    });

    res.json(agendamentos);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" })

    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: { cliente: true, barbeiro: true },
    })
    if (!agendamento) return res.status(404).json({ error: "Agendamento não encontrado" })

    const { user } = req
    if (
      user.papel !== "GERENTE" &&
      user.userId !== agendamento.clienteId &&
      user.userId !== agendamento.barbeiroId
    ) {
      return res.status(403).json({ error: "Acesso negado" })
    }

    res.json(agendamento)
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamento" })
  }
})

router.post("/", authenticateToken, authorizeRoles("USUARIO"), async (req, res) => {
  try {
    const { data, barbeiroId, status } = req.body
    const clienteId = req.user.id

    const novoAgendamento = await prisma.agendamento.create({
      data: {
        data: new Date(data),
        clienteId,
        barbeiroId,
        status,
      },
    })

    res.status(201).json(novoAgendamento)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro ao criar agendamento" })
  }
})

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const agendamento = await prisma.agendamento.findUnique({ where: { id } })

    if (!agendamento) return res.status(404).json({ error: "Agendamento não encontrado" })

    const { user } = req
    const podeEditar =
      user.papel === "GERENTE" ||
      user.userId === agendamento.clienteId ||
      user.userId === agendamento.barbeiroId

    if (!podeEditar) {
      return res.status(403).json({ error: "Acesso negado para atualizar agendamento" })
    }

    const { data, clienteId, barbeiroId, status } = req.body

    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id },
      data: {
        data: data ? new Date(data) : undefined,
        clienteId,
        barbeiroId,
        status,
      },
    })

    res.json(agendamentoAtualizado)
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar agendamento" })
  }
})

router.delete("/:id", authenticateToken, authorizeRoles("GERENTE"), async (req, res) => {
  try {
    const id = Number(req.params.id)
    await prisma.agendamento.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar agendamento" })
  }
})

module.exports = router
