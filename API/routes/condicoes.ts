import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const condicaoSchema = z.object({
     nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    duracao: z.number().int().lte(60).nonnegative(
        { message: "A duração deve possuir apenas numeros inteiros positivos e valor máximo de 60" }),
    descricao: z.string(
        { message: "A descrição deve possuir só caractere string e no mínimo 500 de caractere" }).min(500),
    statusId: z.number().int().nonnegative(
            { message: "PersonagemId obrigatório e deve ser inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const condicoes = await prisma.condicao.findMany({
        include: {
        status: true,
       }
        })
        res.status(200).json(condicoes)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = condicaoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, duracao, descricao, statusId} = valida.data

    try {
      const condicao = await prisma.condicao.create({
        data: {
            nome, duracao, descricao, statusId
        }
      })
      res.status(201).json(condicao)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const condicao = await prisma.condicao.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(condicao)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

  
router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = condicaoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {nome, duracao, descricao, statusId} = valida.data

    try {
        const condicao = await prisma.condicao.update({
            where: { id: Number(id)},
            data: {
                nome, duracao, descricao, statusId
            }
        })
        res.status(200).json(condicao)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router