import type { TKey } from '@dldc/erreur';
import { Erreur, Key } from '@dldc/erreur';

export type THumpfErreurData =
  | { kind: 'InvalidDamperRatio'; received: number }
  | { kind: 'InvalidAngularFrequency'; received: number };

export const HumpfErreurKey: TKey<THumpfErreurData, false> = Key.create<THumpfErreurData>('HumpfErreur');

export const HumpfErreur = {
  InvalidDamperRatio: (received: number) => {
    return Erreur.create(new Error('Damping Ration must be >= 0 (received: ${received})'))
      .with(HumpfErreurKey.Provider({ kind: 'InvalidDamperRatio', received }))
      .withName('HumpfErreur');
  },
  InvalidAngularFrequency: (received: number) => {
    return Erreur.create(new Error('Angular Frequency must be >= 0 (received: ${received})'))
      .with(HumpfErreurKey.Provider({ kind: 'InvalidAngularFrequency', received }))
      .withName('HumpfErreur');
  },
};
