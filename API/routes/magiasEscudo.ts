import { Alvo, Custo, EscudoMax, EscudoMin, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiaescudoSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    escudoMin: z.nativeEnum(EscudoMin),
    escudoMax: z.nativeEnum(EscudoMax),
    alvo: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const magiasescudo = await prisma.magiaEscudo.findMany({})
        res.status(200).json(magiasescudo)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = magiaescudoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, escudoMin, escudoMax, alvo, tipoAlvo, magiaId } = valida.data

    try {
      const magiaescudo = await prisma.magiaEscudo.create({
        data: { subtipo, grau, custo, escudoMin, escudoMax, alvo, tipoAlvo, magiaId}
      })
      res.status(201).json(magiaescudo)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiaescudo = await prisma.magiaEscudo.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiaescudo)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiaescudoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, escudoMin, escudoMax, alvo, tipoAlvo, magiaId } = valida.data

    try {
        const magiaescudo = await prisma.magiaEscudo.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, escudoMin, escudoMax, alvo, tipoAlvo, magiaId
            }
        })
        res.status(200).json(magiaescudo)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router