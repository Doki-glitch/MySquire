import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const caracteristicaArmaSchema = z.object({
     nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    descricao: z.string(
        { message: "A descrição deve possuir só caractere string e no mínimo 2 de caractere" }).min(2),
    armamentoId: z.number().int().nonnegative(
        { message: "ArmamentoId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const caracteristicaArmas = await prisma.caracteristicaArma.findMany({
        include: {
        armamento: true,
       }
        })
        res.status(200).json(caracteristicaArmas)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = caracteristicaArmaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, descricao, armamentoId } = valida.data

    try {
      const caracteristicaArma = await prisma.caracteristicaArma.create({
        data: { nome, descricao, armamentoId }
      })
      res.status(201).json(caracteristicaArma)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const caracteristicaArma = await prisma.caracteristicaArma.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(caracteristicaArma)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

  
router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = caracteristicaArmaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, descricao,  armamentoId } = valida.data

    try {
        const caracteristicaArma = await prisma.caracteristicaArma.update({
            where: { id: Number(id)},
            data: { nome, descricao, armamentoId }
        })
        res.status(200).json(caracteristicaArma)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router