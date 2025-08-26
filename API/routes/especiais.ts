import { Bonus, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const especialSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    descricao: z.string(
        { message: "A descrição deve possuir só caractere string e no máximo 500 de caractere" }).max(500),
    personagemId: z.number().int().nonnegative(
                        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const especiais = await prisma.especiais.findMany({
        include: {
        personagem: true,
       }
        })
        res.status(200).json(especiais)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = especialSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, descricao, personagemId } = valida.data

    try {
      const especial = await prisma.especiais.create({
        data: { nome, descricao, personagemId }
      })
      res.status(201).json(especial)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const especial = await prisma.especiais.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(especial)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = especialSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, descricao, personagemId} = valida.data

    try {
        const especial = await prisma.especiais.update({
            where: { id: Number(id)},
            data: { nome, descricao, personagemId }
        })
        res.status(200).json(especial)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router