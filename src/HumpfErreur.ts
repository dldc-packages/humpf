import type { IKey } from '@dldc/erreur';
import { Erreur, Key } from '@dldc/erreur';

export const HumpfErreur = (() => {
  const InvalidDamperRatioKey: IKey<{ received: number }, false> = Key.create('InvalidDamperRatio');
  const InvalidAngularFrequencyKey: IKey<{ received: number }, false> = Key.create('InvalidAngularFrequency');

  return {
    InvalidDamperRatio: {
      Key: InvalidDamperRatioKey,
      create(received: number) {
        return Erreur.createWith(InvalidDamperRatioKey, { received }).withMessage(
          `Damping Ration must be >= 0 (received: ${received})`,
        );
      },
    },
    InvalidAngularFrequency: {
      Key: InvalidAngularFrequencyKey,
      create(received: number) {
        return Erreur.createWith(InvalidAngularFrequencyKey, { received }).withMessage(
          `Angular Frequency must be >= 0 (received: ${received})`,
        );
      },
    },
  };
})();
