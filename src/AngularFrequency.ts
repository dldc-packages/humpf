export const AngularFrequency = {
  fromMass,
  fromSpringConstant
};

/**
 * Compute the angular frequency from the mass and spring constant
 * @param springContant
 * @param mass
 */
function fromMass(mass: number, springContant: number = 1): number {
  return Math.sqrt(springContant / mass);
}

/**
 * Compute the angular frequency from the mass and spring constant
 * @param springContant
 * @param mass
 */
function fromSpringConstant(springContant: number, mass: number = 1): number {
  return Math.sqrt(springContant / mass);
}
