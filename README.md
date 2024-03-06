<img alt="logo" src="./src/assets/logo.webp" width="500px">

# mottem-sheet Documentation

Welcome to the documentation for `mottem-sheet`, a React.js component designed to help developers effortlessly integrate a bottom sheet component into their mobile applications. This document aims to provide clear and simple instructions for using `mottem-sheet` in your projects.

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
import { ButtonSheet, Sheet, SheetHead, SheetBody, DragAreaEl } from "mottem-sheet";


<ButtonSheet isOpen={isOpen} setIsOpen={setOpen}>
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
</ButtonSheet>
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
import { ButtonSheet, Sheet, SheetBody, DragAreaEl } from "mottem-sheet";

<ButtonSheet isOpen={isOpen} setIsOpen={setOpen}>
  <Sheet
    middlePhases={middlePhases}
    initPhaseActiveIndex={0}
  >
    <SheetBody>
      <DragAreaEl />
      <p>Body Content Here</p>
    </SheetBody>
  </Sheet>
</ButtonSheet>
```

### Component Properties

#### BottomSheet Component Props

- `isOpen`: A boolean indicating if the bottom sheet is open or closed.
- `setIsOpen`: A function to update the `isOpen` state.

#### Sheet Component Props

- `isOpen`: Optional boolean to control the visibility of the sheet.
- `setIsOpen`: Optional function to update the visibility state.
- `initPhaseActiveIndex`: The initial active phase index.
- `initWithNoAnimation`: Optional boolean to initialize the sheet without animation.
- `middlePhases`: An array of phases to control the sheet's behavior.
- `onActiveIndexChange`: Optional function triggered when the active index changes.
