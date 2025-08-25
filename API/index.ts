import express from 'express'
import cors from 'cors'

import routesPersonagens from './routes/personagens'
import routesStatus from './routes/status'
import routesCondicoes from './routes/condicoes'
import routesAtributos from './routes/atributos'
import routesPericias from './routes/pericias'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/personagens", routesPersonagens)
app.use("/status", routesStatus)
app.use("/condicoes", routesCondicoes)
app.use("/atributos", routesAtributos)
app.use("/pericias", routesPericias)

app.get('/', (req, res) => {
  res.send('API: MySquire')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})