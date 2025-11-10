import {  PrismaClient, Tamanho } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const itemSchema = z.object({
      nome: z.string(
             { message: "O nome deve possuir só caractere string e no mínimo 1 de caractere" }).min(1),
         personagemId: z.number().int().nonnegative(
             { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
         quantidade: z.number().int().nonnegative(
             { message: "Quantidade é obrigatória e deve ser número inteiro positivo"}),
         tamanho: z.nativeEnum(Tamanho),
         descricao: z.string(),
})

router.get("/", async (req, res) => {
  try {
    const { personagemId } = req.query;

    const personagemIdNum = Number(req.query.personagemId);
    const filtro = !isNaN(personagemIdNum) && personagemIdNum > 0
  ? { personagemId: personagemIdNum }
  : {};

    const itens = await prisma.item.findMany({
      where: filtro,
      orderBy: { id: "asc" },
    });

    res.status(200).json(itens);
  } catch (error) {
    console.error("Erro ao buscar armaduras:", error);
    res.status(500).json({ erro: "Erro interno ao buscar armaduras" });
  }
});

router.post("/", async (req, res) => {

    const valida = itemSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome,  personagemId, quantidade, tamanho, descricao } = valida.data

    try {
      const item = await prisma.item.create({
        data: {
            nome,  personagemId, quantidade, tamanho, descricao
        }
      })
      res.status(201).json(item)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const item = await prisma.item.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(item)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = itemSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, personagemId, tamanho, descricao, quantidade } = valida.data

    try {
        const item = await prisma.item.update({
            where: { id: Number(id)},
            data: {
                nome, personagemId, tamanho, descricao, quantidade
            }
        })
        res.status(200).json(item)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router