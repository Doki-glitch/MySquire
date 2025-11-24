import { Alcance, Alvo, Custo, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiamoveSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    distancia: z.nativeEnum(Alcance),
    alvos: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
                        { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const magiasmove = await prisma.magiaMove.findMany({})
        res.status(200).json(magiasmove)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


router.post("/", async (req, res) => {

    const valida = magiamoveSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, distancia, alvos, tipoAlvo, magiaId } = valida.data

    try {
      const magiamove = await prisma.magiaMove.create({
        data: { subtipo, grau, custo, distancia, alvos, tipoAlvo, magiaId}
      })
      res.status(201).json(magiamove)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiamove = await prisma.magiaMove.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiamove)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiamoveSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, distancia, alvos, tipoAlvo, magiaId } = valida.data

    try {
        const magiamove = await prisma.magiaMove.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, distancia, alvos, tipoAlvo, magiaId
            }
        })
        res.status(200).json(magiamove)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router