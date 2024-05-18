<img alt="logo" src="./src/assets/logo.webp" width="500px">

# mottem-sheet Documentation

`mottem-sheet` is a bottom-sheet React.js component designed to help developers effortlessly integrate a bottom sheet component into their applications in mobile view. This document aims to provide clear and simple instructions for using `mottem-sheet` in your projects.


## Demo - Sandbox
Online Demo: [Click Here](https://mottem-sheet.vercel.app) to see demo

Sandbox: Here is the sandbox link to check the package [Demo](https://codesandbox.io/p/github/mhmd-sdghn/mottem-sheet/main?import=true&embed=1&file=%2F.codesandbox%2Ftasks.json)
## Overview

`mottem-sheet` is a versatile React.js component developed using TypeScript, ensuring comprehensive support for both React TypeScript and React JavaScript applications. This component offers two distinct modes to cater to various development needs: Header Mode and Free Mode.

### Installation

Before using `mottem-sheet`, you need to install it in your project. You can do this using npm or yarn:

```bash
npm install mottem-sheet
# or
yarn add mottem-sheet
```

### Header Mode

Header Mode allows developers to add content at the top of their applications without specifying the height or phase. This mode automatically positions your content as the first phase, eliminating the need for manual height adjustments.

#### Usage in Header Mode

Here's how you can use `mottem-sheet` in Header Mode:

```jsx
import { BottomSheet, Sheet, SheetHead, SheetBody, DragAreaEl } from "mottem-sheet";


<BottomSheet isOpen={isOpen} setIsOpen={setOpen}>
  <Sheet
    middlePhases={middlePhases}
    initPhaseActiveIndex={0}
  >
    <SheetHead>
      <DragAreaEl />
      <h1 style={{ margin: 0 }}>Header content</h1>
    </SheetHead>
    <SheetBody>
      <p>Body Content Here</p>
    </SheetBody>
  </Sheet>
</BottomSheet>
```

For a complete example, refer to the `HeadMode.tsx` file in the example folder within the source code.

### Free Mode

In Free Mode, you define the stopping points of the bottom sheet using phases. This mode offers more control over the bottom sheet's behavior.

#### Defining a Phase

A phase is an object with `value` and an optional `scrollable` property:

```js
{
  value: number;
  scrollable?: boolean;
}
```

- `value`: A percentage indicating how much of the screen height the bottom sheet should cover.
- `scrollable`: If set to `true`, the body content becomes scrollable. By default, it's `false`.

#### Example of Phases

```js
const middlePhases = [
  {
    value: 20,
    scrollable: false,
  },
  {
    value: 60,
    scrollable: true,
  },
];
```

#### Usage in Free Mode

To use Free Mode, remove the `<SheetHead />` component from the Header Mode example:

```jsx
import { BottomSheet, Sheet, SheetBody, DragAreaEl } from "mottem-sheet";

<BottomSheet isOpen={isOpen} setIsOpen={setOpen}>
  <Sheet
    middlePhases={middlePhases}
    initPhaseActiveIndex={0}
  >
    <SheetBody>
      <DragAreaEl />
      <p>Body Content Here</p>
    </SheetBody>
  </Sheet>
</BottomSheet>
```

### Component Properties

#### BottomSheet Component Props

- `isOpen`: A boolean indicating if the bottom sheet is open or closed.
- `setIsOpen`: A function to update the `isOpen` state.

#### Sheet Component Props

- `isOpen`: Optional boolean to control the visibility of the sheet.
- `setIsOpen`: Optional function to update the visibility state.
- `phaseActiveIndex`: a number indicates index of active phase state.
  `setPhaseActiveIndex`: a function to update active phase index state.
- `initWithNoAnimation`: Optional boolean to initialize the sheet without animation.
- `middlePhases`: An array of phases to control the sheet's behavior.
- `onActiveIndexChange`: Optional function triggered when the active index changes.
- `phaseThreshold`: Safe space keep the phase as where it is, default is 60px.
- `headerStyle`: css inline-style that applies on header.
- `bodyStyle`: css inline-style that applies on body.
- `headerClassName`: css class that applies on header.
- `bodyClassName`: css class that applies on body.
