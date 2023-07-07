import { ErreurType } from '@dldc/erreur';

export const HumpfErreur = {
  InvalidDamperRatio: ErreurType.define<{ received: number }>('InvalidDamperRatio', (err, provider, { received }) => {
    return err.with(provider).withMessage(`Damping Ration must be >= 0 (received: ${received})`);
  }),
  InvalidAngularFrequency: ErreurType.define<{ received: number }>(
    'InvalidAngularFrequency',
    (err, provider, { received }) => {
      return err.with(provider).withMessage(`Angular Frequency must be >= 0 (received: ${received})`);
    },
  ),
};
