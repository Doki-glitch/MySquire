import { Custo, DanoMax, DanoMin, Grau, PrismaClient, Subtipo, VidaInvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiaidoloSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    invoPV: z.nativeEnum(VidaInvo),
    invoATKMin: z.nativeEnum(DanoMin),
    invoATKMax: z.nativeEnum(DanoMax),
    invoDMGMin: z.nativeEnum(DanoMin),
    invoDMGMax: z.nativeEnum(DanoMax),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const magiasidolo = await prisma.magiaIdolo.findMany({
            include: {
            magiaBuff: true,
            magiaDoT: true,
            }
        })
        res.status(200).json(magiasidolo)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = magiaidoloSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo,  invoPV, invoATKMin, invoATKMax, invoDMGMin, invoDMGMax, magiaId } = valida.data

    try {
      const magiaidolo = await prisma.magiaIdolo.create({
        data: { subtipo, grau, custo,  invoPV, invoATKMin, invoATKMax, invoDMGMin, invoDMGMax, magiaId }
      })
      res.status(201).json(magiaidolo)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiaidolo = await prisma.magiaIdolo.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiaidolo)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiaidoloSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo,  invoPV, invoATKMin, invoATKMax, invoDMGMin, invoDMGMax, magiaId } = valida.data

    try {
        const magiaidolo = await prisma.magiaIdolo.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo,  invoPV, invoATKMin, invoATKMax, invoDMGMin, invoDMGMax, magiaId
            }
        })
        res.status(200).json(magiaidolo)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router