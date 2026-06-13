export enum ReferenceLabel {
  LEGIT = 'legit',
  FRAUD = 'fraud',
}

export interface Reference {
  vector: number[]
  label: ReferenceLabel
}

export type References = Reference[]
