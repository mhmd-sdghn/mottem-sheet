import React, { ReactNode } from "react";

interface ChildrenProps {
  children?: ReactNode;
}

type Props<T> = ChildrenProps & T;

export default function ChildrenWithProps<T>(props: Props<T>) {
  const _children = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });

  return <>{_children}</>;
}
