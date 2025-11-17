import { Alvo, Custo, Duracao, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiabuffSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    duracao: z.nativeEnum(Duracao),
    alvos: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
    magiaGolemId : z.number().int().nonnegative().optional(),
    magiaIdoloId : z.number().int().nonnegative().optional(),
})


router.get("/", async (req, res) => {
    try {
        const magiasbuff = await prisma.magiaBuff.findMany({
            include: {
            efeito: true
           }
            })
        res.status(200).json(magiasbuff)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


router.post("/", async (req, res) => {

    const valida = magiabuffSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, duracao, alvos, tipoAlvo, magiaId, magiaGolemId,
            magiaIdoloId } = valida.data

    try {
      const magiabuff = await prisma.magiaBuff.create({
        data: { subtipo, grau, custo, duracao, alvos, tipoAlvo, magiaId, magiaGolemId, magiaIdoloId}
      })
      res.status(201).json(magiabuff)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiabuff = await prisma.magiaBuff.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiabuff)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiabuffSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, duracao, alvos, tipoAlvo, magiaId, magiaGolemId,
             magiaIdoloId  } = valida.data

    try {
        const magiabuff = await prisma.magiaBuff.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, duracao, alvos, tipoAlvo, magiaId, magiaGolemId,
                magiaIdoloId 
            }
        })
        res.status(200).json(magiabuff)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router