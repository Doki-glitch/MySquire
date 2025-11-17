import { Alvo, Custo, Grau, PrismaClient, Subtipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiacurseSchema = z.object({
    subtipo : z.nativeEnum(Subtipo),
    grau: z.nativeEnum(Grau),
    custo: z.nativeEnum(Custo),
    alvo: z.nativeEnum(Alvo),
    tipoAlvo: z.nativeEnum(TipoAlvo),
    magiaId: z.number().int().nonnegative(
            { message: "magiaId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const magiascurse = await prisma.magiaCurse.findMany({
            include: {
            efeito: true
           }
            })
        res.status(200).json(magiascurse)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


router.post("/", async (req, res) => {

    const valida = magiacurseSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { subtipo, grau, custo, alvo, tipoAlvo, magiaId } = valida.data

    try {
      const magiacurse = await prisma.magiaCurse.create({
        data: { subtipo, grau, custo, alvo, tipoAlvo, magiaId}
      })
      res.status(201).json(magiacurse)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magiacurse = await prisma.magiaCurse.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magiacurse)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiacurseSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  subtipo, grau, custo, alvo, tipoAlvo, magiaId } = valida.data

    try {
        const magiacurse = await prisma.magiaCurse.update({
            where: { id: Number(id)},
            data: {
                subtipo, grau, custo, alvo, tipoAlvo, magiaId 
            }
        })
        res.status(200).json(magiacurse)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router