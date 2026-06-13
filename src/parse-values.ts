import { LastTransaction, Terminal, Merchant } from "./interface/transcation.js"
import { MccRisk } from "./interface/mcc-risk.js"

export const findMccRisk = ({ mcc,mcc_risk,}: {mcc: string | null,mcc_risk: MccRisk}): number => {
    if (!mcc) {
      return 0.5
    }
  
    const risk = mcc_risk[mcc]
  
    if (risk === undefined) {
      return 0.5
    }
  
    return risk
  }
  
  
export const hasUnknownMerchant = ({currentmerchant, listMerchants }: {currentmerchant: Merchant | null,listMerchants: string[] | null
  }): number => {
    if (!currentmerchant || !listMerchants) {
      return 1
    }
    return !listMerchants.includes(currentmerchant.id) ? 1 : 0
  }
  
export const parseKmFromHome = ({terminal, max_km,}: {terminal: Terminal | null,max_km: number
  }): number => {
    if (!terminal) {
      return -1
    }
    return limit(terminal.km_from_home / max_km, 0, 1)
  }
  
export const parseKmLastTx = ({last_transaction, max_km,}: {last_transaction: LastTransaction | null,max_km: number
  }): number => {
    if (!last_transaction) {
      return -1
    }
    return limit(last_transaction.km_from_current / max_km, 0, 1)
  }
  
export const parseMinutesSinceLastTx = ({last_transaction,requested_at, max_minutes,}: {last_transaction: LastTransaction | null,requested_at: string,max_minutes: number
  }): number => {
    if (!last_transaction) {
      return -1
    }
  
    const minutes =
      (new Date(requested_at).getTime() - new Date(last_transaction.timestamp).getTime()) /
      (1000 * 60)
  
    return limit(minutes / max_minutes, 0, 1)}
  
export const parseDayOfWeek = (date: string): number => {
    const day = new Date(date).getUTCDay()
    return day / 6
  }
  
export const parseHourOfDay = (date: string): number => {
    const hour = new Date(date).getUTCHours()
    return hour / 23
  }
  
  
export const limit = (x: number, min: number, max: number): number => {
      console.log(x, min, max);
      return Math.max(min, Math.min(x, max))
  }