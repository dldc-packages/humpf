<p align="center">
  <img src="https://github.com/dldc-packages/humpf/blob/58777da6cea44176e102204587922d7231ea2cff/design/logo.png" width="597" alt="humpf logo">
</p>

# 📐 Humpf

> Damped Spring position as a function of time

```bash
npm install @dldc/humpf
```

## What is this

This is a library that lets you animate using
[Damped Springs](http://www.ryanjuckett.com/programming/damped-springs/). The
awesome thing about springs is that they can model all kinds of motions:

- ✅ From A to B with a rebound at the end
- ✅ From A to B smoothly
- ✅ Decay (like pushing something)

## Difference with other libraries

Most libraries out there model a spring by updating a value: on each frame they
compute the forces applied on the value and update it accordingly. Humpf is
different because it doesn't update a value but gives you a function that takes
the **time** as a parameter and returns the **position** and **velocity**
(speed) at that time.

## Gist

```ts
import { Spring } from "@dldc/humpf";

// A spring from 0 to its equilibrium of 100
const spring = Spring({ equilibrium: 100 });

spring(0); // { pos: 0, vel: 0 }
spring(100); // { pos: 13.1312, vel: 33.52 }
spring(200); // { pos: 35.7739, vel: 35.7651 }
spring(300); // { pos: 56.196, vel: 28.6204 }
spring(500); // { pos: 82.1025, vel: 13.576 }
spring(1000); // { pos: 98.6399, vel: 1.1733 }
spring(10000); // { pos: 100, vel: 0 }
```

## Options

You can pass different options to the spring to change its behavior:

```ts
// all the options (see below for more details)
Spring({
  position: 0, // initial position
  equilibrium: 100, // position to approach (aka "to")
  velocity: 0, // initial velocity
  angularFrequency: 1, // how fast does it move ?
  dampingRatio: 1, // how much is it slowed down ?
  timeStart: 0, // time at which the animation should start
  timeScale: 100, // [ADVANCED] change time scale
});
```

### `position` (default `0`)

This is the initial position of the spring: the value it has when it starts (at
`timeStart`).

### `equilibrium` (default `1`)

The equilibrium position of the spring: the value it will reach over time. If
your spring bounces it will oscillate around this value.

### `velocity` (default `0`)

The initial velocity of the spring. `0` means it's stationary.

**Example**: If your spring goes from `0` to `100`, a positive `velocity` means
it's already going up so it will go faster. A negative velocity means it's going
in the opposite direction and will go down a little before going up.

### `angularFrequency` (default `1`)

The angular frequency of your spring defines how fast it wants to move. If you
have a very bouncy spring (not much friction), the angular frequency defines how
many back and forth will happen.

**Example**: `10` means a lot of back and forth, so your spring will move fast.
`0.5` is much lower so your spring will be slower.

### `dampingRatio` (default `1`)

The damping ratio defines how much resistance (friction) is opposed to your
spring.\
If the damping ratio is less than `1` your spring will overshoot and bounce. If
it's over `1` it will not.\
If the damping ratio is `1` it will reach the equilibrium as fast as possible
without bouncing.

### `timeStart` (default `0`)

The time at which the spring should start.\
Usually you want to pass the current time to start a spring "now".

**Note**: spring does not work in reverse, so if you try to get a value for a
time before `timeStart` it will return the initial state.

### `timeScale` (default `1000`)

The `timeScale` allows you to change how time is interpreted. The default value
`1000` means time is in milliseconds and the spring will take about a second to
reach its equilibrium. You probably don't need to change this.

## Math equations

Most of the maths come from
http://www.ryanjuckett.com/programming/damped-springs/.
