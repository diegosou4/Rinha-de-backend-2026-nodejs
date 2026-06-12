import fastify from 'fastify'
import { TransactionRequest } from './interface/transcation.js'
import { Constants } from './interface/constants.js'
import { getFraudScore } from './fraud-score.js'

const server = fastify()

server.get('/ready', async () => {
  return {
    code: 200,
    status: 'ok'
  }
})

server.post('/fraud-score', async (request) => {
  const { transactionRequests, constants }: { transactionRequests: TransactionRequest[], constants: Constants } = request.body as { transactionRequests: TransactionRequest[], constants: Constants }

  const score = await getFraudScore(transactionRequests, constants)
  return {
    code: 200,
    status: 'ok',
    score
  }
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})