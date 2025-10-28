import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const anotacaoSchema = z.object({
     titulo: z.string(
        { message: "O titulo deve possuir só caractere string e no mínimo 1 de caractere" }).min(1),
     subtitulo: z.string(
        { message: "O subtitulo deve possuir só caractere string e no mínimo 1 de caractere" }).min(1),
    descricao: z.string(),
    personagemId: z.number().int().nonnegative(
        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const anotacoes = await prisma.anotacao.findMany({
        include: {
        personagem: true,
       }
        })
        res.status(200).json(atributos)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = anotacaoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { titulo, subtitulo, descricao, personagemId } = valida.data

    try {
      const anotacao = await prisma.anotacao.create({
        data: {
            titulo, subtitulo, descricao, personagemId
        }
      })
      res.status(201).json(anotacao)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const anotacao = await prisma.anotacao.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(anotacao)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

  
router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = anotacaoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { titulo, subtitulo, descricao, personagemId } = valida.data

    try {
        const anotacao = await prisma.anotacao.update({
            where: { id: Number(id)},
            data: {
                titulo, subtitulo, descricao, personagemId
            }
        })
        res.status(200).json(anotacao)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router