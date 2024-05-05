<p align="center">
  <img src="https://github.com/dldc-packages/humpf/blob/58777da6cea44176e102204587922d7231ea2cff/design/logo.png" width="597" alt="humpf logo">
</p>

# 📐 Humpf

> Damped Spring position as a function of time

```bash
npm install @dldc/humpf
```

## What is this

This a library that let you animate using a
[Damped Springs](http://www.ryanjuckett.com/programming/damped-springs/). The
awesome thing about springs is that they can model all king of motions:

- ✅ From A to B with a rebound at the end
- ✅ From A to B smoothly
- ✅ Decay (like pushing something)

## Difference with other libraries

Most library out there will model spring by updating a value: on each frame they
compute the forces applyed on the value and upate it accordingly. Humpf is
different because it does not update a value but give you a function that take
the **time** as parameter and return the **position** and **velocity** (speed)
at that position in time.

## Gist

```ts
import { Spring } from "@dldc/humpf";

const spring = Spring();

spring(0); // { pos: 0, vel: 0 }
spring(100); //  { pos: 26.4241, vel: 36.7879  }
spring(200); //  { pos: 59.3994, vel: 27.0670 }
spring(300); //  { pos: 80.0851, vel: 14.9361 }
spring(500); //  { pos: 95.9572, vel: 3.3689 }
spring(1000); //  { pos: 99.95006, vel: 0.0453 }
spring(10000); //  { pos: 100, vel: 0 }
```

## Options

You can pass different options to the spring to change it's behavior:

```ts
// all the options (see below for more details)
Spring({
  position: 0, // initial velocity
  equilibrium: 100, // position to approach (aka "to")
  velocity: 0, // initial velocity
  angularFrequency: 1, // how fast does it move ?
  dampingRatio: 1, // how much is it slowed down ?
  timeStart: 0, // time at which the annimation should start
  timeScale: 1 / 100, // [ADVANCED] change time scale
});
```

### `position` (default `0`)

This is the initiale position of the spring: the value when it starts (at
`timeStart`).

### `equilibrium` (default `100`)

The equilibrium position of the spring: the value it will reach over time. If
your spring bounce it will occilate around this value.

### `velocity` (default `0`)

The initial velocity of the spring. `0` mean it's stationary.

**Example**: If your spring goes from `0` to `100`, a positive `velocity` mean
it's already going up so it will go faster. A negative velocity means it's going
in the oposite direction and will go down a little before going up.

### `angularFrequency` (default `0`)

The angular frequency of your spring define how fast it wants to move. If you
have a very bouncy spring (not much friction), the angular frequency define how
many back and forth will happen.

**Example**: `10` mean a lot of back and forth, so your spring will move fast.
`0.5` is much lower so your spring will be slower

### `dampingRatio` (default `1`)

The damping ratio define how much resistance (friction) is opposed to your
spring.\
If the damping ratio is less than `1` your spring will overshoot and bounce. If
it's under `1` it will not.\
If the damping ratio is `1` it will reach the equilibrium as fast as possible
without bouncing.

### `timeStart` (default `0`)

The time at which the spring should start.\
Usually you want to pass the current time to start a spring "now".

**Note**: spring does not work in reverse, so you you try to get a value for a
time before `timeStart` it will return the initial state.

### `timeScale` (default `1 / 100`)

The `timeScale` allow you to change how time is interpreted. The default value
`1/100` will make your spring to take about a second to reach equilibrium. You
probably don't need to change this.

## Math equations

Most of the maths come from
http://www.ryanjuckett.com/programming/damped-springs/.
