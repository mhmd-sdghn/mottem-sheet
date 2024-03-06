import styled from "styled-components";

const DragAreaEl = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 0 -12px 36px;
  height: 20px;
  border-radius: 10px 10px 0 0;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    display: block;
    width: 36px;
    height: 4px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.14);
  }
`;

export default DragAreaEl;
