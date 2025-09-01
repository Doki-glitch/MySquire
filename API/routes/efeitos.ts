import {  PrismaClient, TipoEfeito } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const efeitoSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    tipoEfeito: z.nativeEnum(TipoEfeito),
    descricao: z.string(
        { message: "A descrição deve possuir só caractere string e no mínimo 2 de caractere" }).min(2),
    magiaId: z.number().int().nonnegative(
                        { message: "MagiaId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const efeitos = await prisma.efeito.findMany({
        include: {
        magia: true,
       }
        })
        res.status(200).json(efeitos)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = efeitoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, tipoEfeito, descricao, magiaId } = valida.data

    try {
      const efeito = await prisma.efeito.create({
        data: { nome, tipoEfeito, descricao, magiaId}
      })
      res.status(201).json(efeito)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const efeito = await prisma.efeito.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(efeito)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = efeitoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, tipoEfeito, descricao, magiaId} = valida.data

    try {
        const efeito = await prisma.efeito.update({
            where: { id: Number(id)},
            data: { nome, tipoEfeito, descricao, magiaId }
        })
        res.status(200).json(efeito)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router