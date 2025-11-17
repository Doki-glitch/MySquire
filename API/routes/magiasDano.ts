import { Alvo, Custo, DanoMax, DanoMin, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiadanoSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    danoMin: z.nativeEnum(DanoMin),
    danoMax: z.nativeEnum(DanoMax),
    alvos: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const magiasdano = await prisma.magiaDano.findMany({})
        res.status(200).json(magiasdano)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


router.post("/", async (req, res) => {

    const valida = magiadanoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, danoMin, danoMax, alvos, tipoAlvo, magiaId } = valida.data

    try {
      const magiadano = await prisma.magiaDano.create({
        data: { subtipo, grau, custo, danoMin, danoMax, alvos, tipoAlvo, magiaId}
      })
      res.status(201).json(magiadano)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiadano = await prisma.magiaDano.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiadano)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiadanoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, danoMin, danoMax, alvos, tipoAlvo, magiaId } = valida.data

    try {
        const magiadano = await prisma.magiaDano.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, danoMin, danoMax, alvos, tipoAlvo, magiaId
            }
        })
        res.status(200).json(magiadano)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router