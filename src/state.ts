import { Constants } from './interface/constants.js'
import { MccRisk } from './interface/mcc-risk.js'
import { References } from './interface/references.js'

export const appState = {
  isReady: false,
  normalization: null as Constants | null,
  mccRisk: null as MccRisk | null,
  references: null as References | null,
}
