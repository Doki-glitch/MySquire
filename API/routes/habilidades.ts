import { Bonus, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const habilidadeSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    valor: z.number().lte(20),
    profissaoId: z.number().int().nonnegative(
                        { message: "ProfissaoId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const habilidades = await prisma.habilidade.findMany({
        include: {
        profissao: true,
       }
        })
        res.status(200).json(habilidades)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = habilidadeSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, valor, profissaoId } = valida.data

    try {
      const habilidade = await prisma.habilidade.create({
        data: { nome, valor, profissaoId }
      })
      res.status(201).json(habilidade)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const habilidade = await prisma.habilidade.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(habilidade)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = habilidadeSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, valor, profissaoId} = valida.data

    try {
        const habilidade = await prisma.habilidade.update({
            where: { id: Number(id)},
            data: { nome, valor, profissaoId }
        })
        res.status(200).json(habilidade)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router