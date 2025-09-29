import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()
const router = Router()

router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha ) {
    return res.status(400).json({ erro: "Preencha todos os campos" })
  }

  try {
    const existe = await prisma.usuario.findFirst({ where: { email } })
    if (existe) {
      return res.status(400).json({ erro: "E-mail já cadastrado" })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    })

    res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    })
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar usuario", detalhe: error })
  }
})

export default router
