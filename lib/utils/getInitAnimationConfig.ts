

const getInitAnimationConfig = (viewHeight: number, initWithNoAnimation: boolean, hasHeader: boolean, newY: number, first_mount: boolean) =>
  initWithNoAnimation && first_mount ? {
      y: newY,
      immediate: true,
    }
    : {
      from : {
        y: hasHeader && first_mount ? viewHeight : !first_mount ? null : 0
      },
      to: {
        y: newY,
      },
    }


export default getInitAnimationConfig;