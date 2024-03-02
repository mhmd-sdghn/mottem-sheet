import React, { PropsWithChildren } from "react";

type Props<T> = PropsWithChildren & T;

export default function ChildrenWithProps<T>(props: Props<T>) {
  const { children, ...restProps } = props;

  const _children = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, restProps);
    }

    return child;
  });

  return <>{_children}</>;
}
