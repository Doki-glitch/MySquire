import { Alcance, Alvo, Custo, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiaremoveSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    distancia: z.nativeEnum(Alcance),
    alvo: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const magiasremove = await prisma.magiaRemove.findMany({})
        res.status(200).json(magiasremove)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = magiaremoveSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, distancia, alvo, tipoAlvo, magiaId } = valida.data

    try {
      const magiaremove = await prisma.magiaRemove.create({
        data: { subtipo, grau, custo, distancia, alvo, tipoAlvo, magiaId}
      })
      res.status(201).json(magiaremove)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiaremove = await prisma.magiaRemove.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiaremove)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiaremoveSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, distancia, alvo, tipoAlvo, magiaId } = valida.data

    try {
        const magiaremove = await prisma.magiaRemove.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, distancia, alvo, tipoAlvo, magiaId 
            }
        })
        res.status(200).json(magiaremove)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router