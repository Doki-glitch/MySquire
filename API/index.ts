import express from 'express'
import cors from 'cors'

import routesPersonagens from './routes/personagens'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/personagens", routesPersonagens)


app.get('/', (req, res) => {
  res.send('API: MySquire')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})