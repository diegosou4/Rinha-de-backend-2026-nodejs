import { TransactionRequest } from "./interface/transcation.js"
import { Vector } from "./interface/vector.js"
import { Constants } from "./interface/constants.js"
import { LastTransaction } from "./interface/transcation.js"
export const getFraudScore = async (_transactionRequests: TransactionRequest[], _constants: Constants) => {

  const vectors: Vector[] = []

  for (const transactionRequest of _transactionRequests) {
    const vector: Vector = {
      amount: limit(transactionRequest.transaction.amount / _constants.max_amount, 0, 1),
      installments: limit(transactionRequest.transaction.installments, 1, _constants.max_installments),
      amount_vs_avg: limit(transactionRequest.transaction.amount / transactionRequest.customer.avg_amount, 0, 1),
      hour_of_day: parseHourOfDay(transactionRequest.transaction.requested_at),
      day_of_week: parseDayOfWeek(transactionRequest.transaction.requested_at),
      minutes_since_last_tx: parseMinutesSinceLastTx({ last_transaction: transactionRequest.last_transaction, requested_at: transactionRequest.transaction.requested_at, max_minutes: _constants.max_minutes }),
    // km_from_last_tx: parseKmFromLastTx({ last_transaction: transactionRequest.last_transaction, requested_at: transactionRequest.transaction.requested_at, max_km: _constants.max_km }),

    }
    vectors.push(vector)
    console.log(vector);
  }

  return [0.0];
}   


const parseMinutesSinceLastTx = ({last_transaction,requested_at, max_minutes,}: {last_transaction: LastTransaction | null,requested_at: string,max_minutes: number
}): number => {
  if (!last_transaction) {
    return -1
  }

  const minutes =
    (new Date(requested_at).getTime() - new Date(last_transaction.timestamp).getTime()) /
    (1000 * 60)

  return limit(minutes / max_minutes, 0, 1)}

const parseDayOfWeek = (date: string): number => {
  const day = new Date(date).getUTCDay()
  return day / 6
}

const parseHourOfDay = (date: string): number => {
  const hour = new Date(date).getUTCHours()
  return hour / 23
}


const limit = (x: number, min: number, max: number): number => {
    console.log(x, min, max);
    return Math.max(min, Math.min(x, max))
}