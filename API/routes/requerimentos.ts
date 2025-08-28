import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const requerimentoSchema = z.object({
     atributo: z.string(
        { message: "O atributo deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    valor: z.number().int(
        { message: "O valor deve possuir apenas numeros inteiros positivos e valor maior do que  zero" }).gte(1),
    armamentoId: z.number().int().nonnegative(
        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const requerimentos = await prisma.requerimento.findMany({
        include: {
        armamento: true,
       }
        })
        res.status(200).json(requerimentos)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = requerimentoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { atributo, valor, armamentoId } = valida.data

    try {
      const requerimento = await prisma.requerimento.create({
        data: { atributo, valor, armamentoId }
      })
      res.status(201).json(requerimento)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const requerimento = await prisma.requerimento.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(requerimento)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = requerimentoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { atributo, valor, armamentoId } = valida.data

    try {
        const requerimento = await prisma.requerimento.update({
            where: { id: Number(id)},
            data: { atributo, valor, armamentoId }
        })
        res.status(200).json(requerimento)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router