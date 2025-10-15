import { PrismaClient, Tipo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiaSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    tipo: z.nativeEnum(Tipo),
})

router.get("/", async (req, res) => {
    try {
        const magias = await prisma.magia.findMany({
        include: {
        cura: true,
        buff: true,
        cleanse: true,
        movimento: true,
        dano: true,
        dot: true,
        debuff: true,
        curse: true,
        moveIni: true,
        escudo: true,
        resguardo: true,
        zumbi: true,
        golem: true,
        bicho: true
       }
        })
        res.status(200).json(magias)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = magiaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    console.log(res)

    const { nome, tipo} = valida.data

    try {
      const magia = await prisma.magia.create({
        data: { nome, tipo }
      })
      res.status(201).json(magia)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magia = await prisma.magia.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magia)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, tipo } = valida.data

    try {
        const magia = await prisma.magia.update({
            where: { id: Number(id)},
            data: {
                nome, tipo
            }
        })
        res.status(200).json(magia)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router