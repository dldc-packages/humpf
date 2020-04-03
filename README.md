<p align="center">
  <img src="https://github.com/etienne-dldc/humpf/blob/master/design/logo.png" width="597" alt="humpf logo">
</p>

# 📐 Humpf [![Build Status](https://travis-ci.org/etienne-dldc/humpf.svg?branch=master)](https://travis-ci.org/etienne-dldc/humpf) [![](https://badgen.net/bundlephobia/minzip/humpf)](https://bundlephobia.com/result?p=humpf) [![codecov](https://codecov.io/gh/etienne-dldc/humpf/branch/master/graph/badge.svg)](https://codecov.io/gh/etienne-dldc/humpf)

> Damped Spring position as a function of time

## What is this

This a library that let you animate using a [Damped Springs](http://www.ryanjuckett.com/programming/damped-springs/). The awesome thing about springs is that they can model all king of motions:

- ✅ From A to B with a rebound at the end
- ✅ From A to B smoothly
- ✅ Decay (like pushing something)

## Difference with other libraries

Most library out there will model spring by updating a value: on each frame they compute the forces applyed on the value and upate it accordingly.
Humpf is different because it does not update a value but give you a function that take the **time** as parameter and return the **position** and **velocity** (speed) at that position in time.

## Gist

```ts
import { Spring } from 'humpf';

const spring = Spring.create();

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
Spring.create({
  position: 0, // initial velocity
  equilibrium: 100, // position to approach (aka "to")
  velocity: 0, // initial velocity
  angularFrequency: 1, // how fast does it move ?
  dampingRatio: 1, // how much is it slowed down ?
  timeStart: 0 // time at which the annimation should start
  timeScale: 1 / 100, // [ADVANCED] change time scale
})
```

### `position` [=`0`]

This is the initiale position of the spring: the value when it starts.

### `equilibrium` [=`100`]

The equilibrium position of the spring: the value it will reach over time. If your spring bounce it will occilate around this value.

### `velocity` [=`0`]

The initial velocity of the spring. `0` mean it's stationary.

**Example**: If your spring goes from `0` to `100`, a positive `velocity` mean it's already going up so it will go faster. A negative velocity means it's going in the oposite direction and will go down a little before going up.

### `angularFrequency` [=`0`]

The angular frequency of your spring define how fast it wants to move. If you have a very bouncy spring (not much friction), the angular frequency define how many back and forth will happen.

**Example**: `10` mean a lot of back and forth, so your spring will move fast. `0.5` is much lower so your spring will be slower

### `dampingRatio` [=`1`]

The damping ratio define how much resistance (friction) is opposed to your spring.
If the damping ratio is less than `1` your spring will overshoot and bounce. If it's under `1` it will not.
If the damping ratio is `1` it will reach the equilibrium as fast as possible without bouncing.

### `timeStart` [=`0`]

The time at which the spring should start. If you pass a time before the `timeStart` to a spring it will predent like it's `0`.

### `timeScale` [=`1 / 100`]

The `timeScale` allow you to change how time is interpreted. The default value `1/100` wille make your spring to take about a second to reach equilibrium. You probably don't need to change this.

## SpringBuilder

The `SpringBuilder` builder allow you to easily manipulate spring config, use presets, and more.

### Creating a `SpringBuilder`

`SpringBuilder` is a `class`, you can either call `new` or use the `default` static method:

```ts
const sb1 = new SpringBuilder();
const sb2 = SpringBuilder.default();
```

### Converting a `SpringBuilder` to a string

To get the `spring` function, just call `.spring` on a spring builder:

```ts
const sb1 = new SpringBuilder();
const spring = sb1.spring;
```

**Note**: The spring is memoized so you can access `.spring` without worying about perf.

### Overriding config

Both method to create a `SpringBuilder` accept an object as arguments where you can override the default options:

```ts
const sb1 = new SpringBuilder({
  angularFrequency: 1.1,
  dampingRatio: 0.7
});

const sb2 = SpringBuilder.default({
  position: -100,
  equilibrium: 0
});
```

You can also use the `expends` method on an existing `SpringBuilder` to create a new one without changing the first (`SpringBuilder` are immutable).

```ts
const sb3 = sb2.extends({
  timeStart: 1000
});
```

### Presets

Instead of `.default` you can use one the preset:

```ts
SpringBuilder.gentle();
SpringBuilder.wobbly();
SpringBuilder.stiff();
SpringBuilder.slow();
```

**Note**: Each of thes function accept an object as argument to override any configuration.

### Decay

A decay motion is a motion where the distance traveled is defined by the velocity of the object.
To create a `decay` you can either use the `SpringBuilder.decay()` preset or call `.decay()` method on an existing `SpringBuilder`.

```ts
const m1 = SpringBuilder.decay({ velocity: 1000 });
const m1 = SpringBuilder.default({ angularFrequency: 1.1, velocity: 2000 }).decay();
```

**Note**: A decay will always have a `dampingRatio` of `1`, but you can still override it with `.extends`.

## Math equations

Most of the maths come from http://www.ryanjuckett.com/programming/damped-springs/.
