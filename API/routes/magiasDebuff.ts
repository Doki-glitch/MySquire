import { Alvo, Custo, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiadebuffSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    alvo: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
    magiaNecroId: z.number().int().nonnegative().optional(),
})

router.get("/", async (req, res) => {
    try {
        const magiasdebuff = await prisma.magiaDebuff.findMany({})
        res.status(200).json(magiasdebuff)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = magiadebuffSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, alvo, tipoAlvo, magiaId, magiaNecroId } = valida.data

    try {
      const magiadebuff = await prisma.magiaDebuff.create({
        data: { subtipo, grau, custo, alvo, tipoAlvo, magiaId, magiaNecroId}
      })
      res.status(201).json(magiadebuff)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiadebuff = await prisma.magiaDebuff.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiadebuff)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiadebuffSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, alvo, tipoAlvo, magiaId, magiaNecroId } = valida.data

    try {
        const magiadebuff = await prisma.magiaDebuff.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, alvo, tipoAlvo, magiaId, magiaNecroId
            }
        })
        res.status(200).json(magiadebuff)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router