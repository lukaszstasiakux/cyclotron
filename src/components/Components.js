import React from 'react';
import styled from 'styled-components';

export const PageWrapper = styled.div`
  width:100vw;
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background-color:rgba(0,0,0,0.8);
  font-family: 'Roboto', sans-serif;
  color:#6b96cc;

`;

export const Console = styled.div`
  width:100%;
  max-width:800px;
  height:500px;
  overflow: auto;
  // border:1px solid #5fb7d4;

  background-color:rgba(42,67,105,0.6);
  padding:20px;
  border-radius:2px;

  border-top: 1px solid #5fb7d4;
  border-bottom: 1px solid #ffffff;
  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#5fb7d4), to(#ffffff));
  background-image: -webkit-linear-gradient(#5fb7d4, #ffffff);
  background-image:
      -moz-linear-gradient(#5fb7d4, #ffffff),
      -moz-linear-gradient(#5fb7d4, #ffffff);
  background-image:
      -o-linear-gradient(#5fb7d4, #ffffff),
      -o-linear-gradient(#5fb7d4, #ffffff);
  background-image: 
      linear-gradient(#5fb7d4, #ffffff),
      linear-gradient(#5fb7d4, #ffffff);
  -moz-background-size: 1px 100%;
  background-size: 1px 100%;
  background-position: 0 0, 100% 0;
  background-repeat: no-repeat; 
`

export const Line = styled.div`
  font-size:16px;
  color:#5fb7d4;
  width:100%;
  margin-bottom:10px;
  
`

export const Input = styled.input`
  font-size:16px;
  color:#5fb7d4;
  background-color:rgba(255,255,255,0.0);
  border:none;
  border-bottom:1px solid #5fb7d4;
  display:inline;
  width:${p => p.small? '50px':'300px'};
  margin-left:${p => p.right? '10px':'0'};
  margin-right:${p => p.left? '10px':'0'};
  outline:none;
  & :focus{
    outline:none;
  }
`
export const Button = styled.div`
  font-size:16px;
  color:#5fb7d4;
  border:1px solid #5fb7d4;
  padding:5px 20px;
  cursor:pointer;
  display:inline-block;
  transition:300ms;
  margin-left:${p => p.right? '10px':'0'};
  &:hover{
    background-color:rgba(127, 209, 228, 0.46);
    transition:300ms;
  }
`
export const FolderWrapper = styled.div`
  width:100%;
  display:flex;
  flex-wrap:wrap;
  margin-bottom:10px;
`
export const HowUse = styled.div`
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  width:100%;
  padding-bottom:5px;
  text-align:center;
  a{
    color:#5fb7d4;
    font-size:14px;
  }
  a:visited{
    color:#5fb7d4;
  }
`

