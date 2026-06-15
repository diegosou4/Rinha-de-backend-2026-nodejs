export enum ReferenceLabel {
  LEGIT = 'legit',
  FRAUD = 'fraud',
}

export interface Reference {
  vector: number[]
  label: ReferenceLabel
}

export type References = Reference[]

export interface CompactReferences {
  count: number
  dims: number
  vectors: Float32Array
  labels: Uint8Array
}
