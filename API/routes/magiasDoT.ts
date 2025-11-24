import { Alvo, Custo, DanoMax, DanoMin, Duracao, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiadotSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    danoMin: z.nativeEnum(DanoMin),
    danoMax: z.nativeEnum(DanoMax),
    duracao: z.nativeEnum(Duracao),
    alvos: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
    magiaIdoloId: z.number().int().nonnegative().optional(),
})

router.get("/", async (req, res) => {
    try {
        const magiasdot = await prisma.magiaDoT.findMany({})
        res.status(200).json(magiasdot)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = magiadotSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, danoMin, danoMax, duracao, alvos, tipoAlvo, magiaId } = valida.data

    try {
      const magiadot = await prisma.magiaDoT.create({
        data: { subtipo, grau, custo, danoMin, danoMax, duracao, alvos, tipoAlvo, magiaId}
      })
      res.status(201).json(magiadot)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiadot = await prisma.magiaDoT.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiadot)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiadotSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, danoMin, danoMax,duracao, alvos, tipoAlvo, magiaId } = valida.data

    try {
        const magiadot = await prisma.magiaDoT.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, danoMin, danoMax, duracao, alvos, tipoAlvo, magiaId
            }
        })
        res.status(200).json(magiadot)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router