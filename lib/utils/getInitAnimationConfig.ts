

const getInitAnimationConfig = (viewHeight: number, initWithNoAnimation: boolean, hasHeader: boolean, newY: number) =>
  initWithNoAnimation ? {
      y: newY,
      immediate: true,
    }
    : {
      from : {
        y: hasHeader ? viewHeight : 0
      },
      to: {
        y: newY,
      },
    }


export default getInitAnimationConfig;