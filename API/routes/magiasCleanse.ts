import { Alvo, Custo, Grau, PrismaClient, Purifica, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiacleanseSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    purifica: z.nativeEnum(Purifica),
    alvos: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
                        { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const magiascleanse = await prisma.magiaCleanse.findMany({})
        res.status(200).json(magiascleanse)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


router.post("/", async (req, res) => {

    const valida = magiacleanseSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, purifica, alvos, tipoAlvo, magiaId } = valida.data

    try {
      const magiacleanse = await prisma.magiaCleanse.create({
        data: { subtipo, grau, custo, purifica, alvos, tipoAlvo, magiaId}
      })
      res.status(201).json(magiacleanse)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiacleanse = await prisma.magiaCleanse.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiacleanse)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiacleanseSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, purifica, alvos, tipoAlvo, magiaId } = valida.data

    try {
        const magiacleanse = await prisma.magiaCleanse.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, purifica, alvos, tipoAlvo, magiaId
            }
        })
        res.status(200).json(magiacleanse)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router