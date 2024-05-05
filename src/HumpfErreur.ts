import { createErreurStore, type TErreurStore } from "@dldc/erreur";

export type THumpfErreurData =
  | { kind: "InvalidDamperRatio"; received: number }
  | { kind: "InvalidAngularFrequency"; received: number };

const HumpfErreurInternal: TErreurStore<THumpfErreurData> = createErreurStore<
  THumpfErreurData
>();

export const HumpfErreur = HumpfErreurInternal.asReadonly;

export function throwInvalidDamperRatio(received: number): never {
  return HumpfErreurInternal.setAndThrow(
    `Damping Ration must be >= 0 (received: ${received})`,
    {
      kind: "InvalidDamperRatio",
      received,
    },
  );
}

export function throwInvalidAngularFrequency(received: number): never {
  return HumpfErreurInternal.setAndThrow(
    `Angular Frequency must be >= 0 (received: ${received})`,
    {
      kind: "InvalidAngularFrequency",
      received,
    },
  );
}
