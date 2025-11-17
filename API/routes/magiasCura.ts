import { Alvo, CuraMax, CuraMin, Custo, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiacuraSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    curaMin: z.nativeEnum(CuraMin),
    curaMax: z.nativeEnum(CuraMax),
    alvos: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
                        { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const magiascura = await prisma.magiaCura.findMany({})
        res.status(200).json(magiascura)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


router.post("/", async (req, res) => {

    const valida = magiacuraSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, curaMin, curaMax, alvos, tipoAlvo, magiaId } = valida.data

    try {
      const magiacura = await prisma.magiaCura.create({
        data: { subtipo, grau, custo, curaMin, curaMax, alvos, tipoAlvo, magiaId}
      })
      res.status(201).json(magiacura)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiacura = await prisma.magiaCura.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiacura)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiacuraSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, curaMin, curaMax, alvos, tipoAlvo, magiaId } = valida.data

    try {
        const magiacura = await prisma.magiaCura.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, curaMin, curaMax, alvos, tipoAlvo, magiaId
            }
        })
        res.status(200).json(magiacura)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router