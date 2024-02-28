import styled from "styled-components";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  height?: string;
}

export default function ItemSheet(props: Props) {
  return <Wrapper height={props.height}>{props.children}</Wrapper>;
}

const Wrapper = styled.div<{ height?: string }>`
  height: ${(props) => props.height || "auto"};
  max-height: 100%;
  overflow-y: auto;
  background: blue;
`;
