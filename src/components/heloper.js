import React from 'react';

export const setLocalStorage = (label,value) => {

  if(localStorage.getItem(label) != null){
    localStorage[label] = value;
  } else {
    localStorage.setItem(label, value);
  }
}
export const oauth_verifier = (data) =>{
  const search = data.split("?");
  const res = search[1].split("&");
  const result ={
    oauth_token : res[0].split("=")[1],
    oauth_verifier : res[1].split("=")[1]
  }
  for (var key in result) {
    setLocalStorage(key, result[key])
  }
  return result;
}

export const oauth_tokens = (data) => {
  const res = data.split("&");
  const oauth_token_secret = res[2].split("=");
  setLocalStorage('oauth_token_secret', oauth_token_secret[1])
  return oauth_token_secret[1];
}

export const get_access_token = (data) => {
  const res = data.split("&");
  const result = {
    fullname: res[0].split("=")[1],
    oauth_token : res[1].split("=")[1],
    oauth_token_secret: res[2].split("=")[1],
    user_nsid: res[3].split("=")[1],
    username: res[4].split("=")[1]
  }
  for (var key in result) {
    setLocalStorage(key, result[key])
  }
  return result;
}

export const resetData = () =>{
  localStorage.clear();
}
export const getFolderName = (data) => {
  const partTime = data.split("-");
  const result = {
    name : partTime[0] +'_'+partTime[1],
    display : partTime[0] +'-'+partTime[1]
  }
  return result;
}

export const setFolderProps = (label,value) => {
  if(localStorage.getItem(label) == null){
    localStorage.setItem(label, value);
  }
}
export const setCompleteFolder =(name) => {
  localStorage[name] = 'downloaded';
}