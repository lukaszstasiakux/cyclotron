import React from 'react';
import styled,  { keyframes } from "styled-components";

const blinkCursor = keyframes`
  0% { 
    opacity:1;
  }
  50% { 
    opacity:1;
  }
  51% { 
    opacity:0;
  }
  100% { 
    opacity:0;
  }`;

const LoaderWrapper = styled.div`
    display: inline-block;
    margin-left: 10px;
    position: relative;
    bottom: 0px;
    height: 18px;
`
const LoaderElement = styled.div`
    animation:${blinkCursor} 1s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    display: flex;
    opacity:1;
    height: 17px;
    width: 9px;
    position: absolute;
    background-color: #5fb7d4;
    bottom: -2px;
`

const Loader = () => (
  <LoaderWrapper>
    <LoaderElement/>
  </LoaderWrapper>
)

export default Loader