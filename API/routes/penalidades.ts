import {  PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const penalidadeSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    valor: z.number().lte(20),
    armamentoId: z.number().int().nonnegative(
                        { message: "ProfissaoId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const penalidades = await prisma.penalidade.findMany({
        include: {
        armamento: true,
       }
        })
        res.status(200).json(penalidades)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = penalidadeSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, valor, armamentoId } = valida.data

    try {
      const penalidade = await prisma.penalidade.create({
        data: { nome, valor, armamentoId }
      })
      res.status(201).json(penalidade)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const penalidade = await prisma.penalidade.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(penalidade)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = penalidadeSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, valor, armamentoId} = valida.data

    try {
        const penalidade = await prisma.penalidade.update({
            where: { id: Number(id)},
            data: { nome, valor, armamentoId }
        })
        res.status(200).json(penalidade)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router