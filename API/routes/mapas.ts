import { PrismaClient, Tipo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const mapaSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 1 de caractere" }).min(1),
    personagemId: z.number().int().nonnegative(
                        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
    imagem: z.string().optional(),
})


router.get("/", async (req, res) => {
    try {
        const mapas = await prisma.mapa.findMany({})
        res.status(200).json(mapas)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = mapaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome,  personagemId, imagem} = valida.data

    try {
      const mapa = await prisma.mapa.create({
        data: { nome,  personagemId, imagem }
      })
      res.status(201).json(mapa)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const mapa = await prisma.mapa.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(mapa)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = mapaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome,  personagemId, imagem } = valida.data

    try {
        const mapa = await prisma.mapa.update({
            where: { id: Number(id)},
            data: {
                nome, personagemId, imagem
            }
        })
        res.status(200).json(mapa)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router