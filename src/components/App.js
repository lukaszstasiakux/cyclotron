import React,{Fragment} from 'react';
import axios from 'axios';
import {PageWrapper,Console,Line,Input,Button,FolderWrapper} from './Components';
import Loader from './Loader';
import Folder from './Folder'
import {oauth_verifier,oauth_tokens,get_access_token,setLocalStorage,resetData,getFolderName,setFolderProps,setCompleteFolder} from './heloper';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userID:'',
      apiKey:localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : '',
      secretKey:localStorage.getItem('secretKey') ? localStorage.getItem('secretKey') : '' ,
      oauth_token:localStorage.getItem('oauth_token') ? localStorage.getItem('oauth_token') : '' ,
      oauth_token_secret: localStorage.getItem('oauth_token_secret') ? localStorage.getItem('oauth_token_secret') : '' ,    
      auth:localStorage.getItem('auth') ? localStorage.getItem('auth') : false,
      authError:false,
      step_collectData:false,
      step_action:true,
      step_download:false,
      step_complete:false,
      collectData:false,
      credentional:false,
      photos:[],
      folders:{},
      selectedFolder:[],
      selectedCount:0,
      page: 0,
      pages: 0,
      total: 0,
      downloadIndex:0,
      imageName:''
    }
  }

  setAuthData = (e,key)=>{
    this.setState({
      [key]:e.target.value,
      authError:false,
    })
  }
  
  reset = ()=>{
    this.setState({
      step_action:true,
      step_download:false,
      step_complete:false,
      selectedFolder:[],
    })
  }
  credentional = ()=>{
    this.setState({
      credentional:true,
      step_complete:false,
      step_download:false,
      step_collectData:false,
    })
  }

  selectFolder = (name)=>{
    let selecetd = this.state.selectedFolder;
    if(selecetd.indexOf(name) == -1){
      selecetd.push(name);
    } else{
      selecetd = selecetd.filter( (folder)=> {
        return folder!=name
      });
    }

    let count = 0;
    selecetd.map(key => {
      count = count + this.state.folders[key].photos.length
    })
    this.setState({
      selectedFolder:selecetd,
      selectedCount:count
    })
  }

  downloadPhoto = (imageIndex,folderIndex) =>{
    const self = this;
    const folderName = self.state.selectedFolder[folderIndex]
    if(imageIndex < self.state.folders[folderName].photos.length){
      const params = {
        apiKey: self.state.apiKey,
        secretKey: self.state.secretKey,
        oauth_token: localStorage.getItem('oauth_token'),
        oauth_token_secret: localStorage.getItem('oauth_token_secret'),
        imageId: self.state.folders[folderName].photos[imageIndex].id,
        userID: localStorage.getItem('user_nsid'),
      };
      axios({
        method: 'post',
        url: '/php/get_photo_detail.php',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(params)
      })
      .then(function (response) {
          if(response.data.stat=="ok"){
            const size = response.data.sizes.size;
            const media = size[size.length-1].media;
            const img_url = size[size.length-1].source;
            if(media ==='photo'){
              const extention = size[size.length-1].source.split('.')
              const img_name = self.state.folders[folderName].photos[imageIndex].title+'.'+extention[extention.length-1]
              self.setState({
                imageName:img_name,
                downloadIndex:self.state.downloadIndex + 1
              })
                axios({
                  url: img_url,
                  method: 'GET',
                  responseType: 'blob', 
                }).then(function (response) {
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download',img_name);
                  document.body.appendChild(link);
                  link.click();
                }).catch(function (error) {
                  console.log(error)
                }); 
            }else if(media === 'video'){
                const link = document.createElement('a');
                link.href = 'https://www.flickr.com/video_download.gne?id='+self.state.folders[folderName].photos[imageIndex].id;
                document.body.appendChild(link);
                link.click();
            }
            
            imageIndex++;
            setTimeout(function(){
              self.downloadPhoto(imageIndex,folderIndex);
            }, 2000);
          } else{
            console.log('access error')
          }
      }).catch(function (error) {
        console.log(error)
      });
    } else{
      setCompleteFolder(folderName);
      folderIndex++;
      this.downloadFolder(folderIndex);
    }
  };
  downloadFolder = (folderIndex)=>{
    if(folderIndex < this.state.selectedFolder.length){
      setLocalStorage(this.state.selectedFolder[folderIndex],'inprogress');
      this.downloadPhoto(0,folderIndex);
    }else{
      this.setState({
        step_download:false,
        selectedFolder:[],
        step_complete:true,
      })
    }
  }; 
  download = () => {
    this.setState({
      step_action:false,
      step_download:true
    })
      this.downloadFolder(0)
  }

  generateFolders = () => {
    const folders = {};
    this.state.photos.map(photo => {
      let folder = getFolderName(photo.datetaken);
      if(folders[folder.name] == undefined) {
        const newFolder= {
          name: folder.name,
          display: folder.display,
          photos:[photo]
        }
        folders[folder.name] = newFolder;
        setFolderProps(folder.name, 'ready')
      } else {
        folders[folder.name].photos.push(photo);
      }
    })
    this.setState({
      folders:folders,
      collectData:true,
    })
  }

  calculateData = (page)=> {
    const self = this;
    if(page <= this.state.pages){
      const params = {
       apiKey: this.state.apiKey,
       secretKey: this.state.secretKey,
       oauth_token: localStorage.getItem('oauth_token'),
       oauth_token_secret: localStorage.getItem('oauth_token_secret'),
       userID: localStorage.getItem('user_nsid'),
       page: page,
      };
 
      axios({
        method: 'post',
        url: '/php/collect_photos.php',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(params)
      })
      .then(function (response) {
          self.setState({
            photos:self.state.photos.concat(response.data.photos.photo)
          })
          page++;
          self.calculateData(page);    
      }).catch(function (error) {
        console.log(error)
      });
    } else{
      this.generateFolders();
    }
  }
  checkData = () => {
    const self = this;
    self.setState({
      step_collectData:true,
      collectData:false,
    });
    const params = {
       apiKey: this.state.apiKey,
       secretKey: this.state.secretKey,
       oauth_token: localStorage.getItem('oauth_token'),
       oauth_token_secret: localStorage.getItem('oauth_token_secret'),
       userID: localStorage.getItem('user_nsid')
    };
 
    axios({
      method: 'post',
      url: '/php/check_data.php',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(params)
    })
     .then(function (response) {
      self.setState({
        photos:[],
        page: response.data.photos.page,
        pages: response.data.photos.pages,
        total: response.data.photos.total,
      })
      self.calculateData(1);
    }).catch(function (error) {
      console.log(error)
    });
  }
  connect = ()=> {
    localStorage.setItem('apiKey', this.state.apiKey);
    localStorage.setItem('secretKey', this.state.secretKey);
    const params = {
      'apiKey': this.state.apiKey,
      'secretKey': this.state.secretKey
    }
 
    axios({
      method: 'post',
      url: '/php/get.php',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(params)
    })
     .then(function (response) {
        oauth_tokens(response.data.token);
        window.location.replace(response.data.url);
    }).catch(function (error) {
      console.log(error)
    });
  }

  loginSuccess = () => {
    setLocalStorage('auth',true);
    this.setState({
      auth: true,
      authError:false
    })
    this.checkData();
  }
  loginError = () => {
    this.setState({
      auth: false,
      authError:true
    })
  }
  loginUser = () => {
    const self = this;
    const params = {
       apiKey: this.state.apiKey,
       secretKey: this.state.secretKey,
       oauth_token: localStorage.getItem('oauth_token'),
       oauth_token_secret: localStorage.getItem('oauth_token_secret'),
    };
    axios({
      url: '/php/login.php',
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(params)
    }).then(function (response) {
      if(response.data.stat == 'ok'){
        self.loginSuccess();
      } else {
        self.loginError();
      }
    }).catch(function (error) {
      console.log(error)
      self.loginError();
    });
  };

  generateToken = () => {
    const self = this;
    const get_ouath_verifier = oauth_verifier(this.props.location.search)
    const params = {
      'apiKey': this.state.apiKey,
      'secretKey': this.state.secretKey,
      'oauth_token': localStorage.getItem('oauth_token'),
      'oauth_verifier': localStorage.getItem('oauth_verifier') ,
      'oauth_token_secret':localStorage.getItem('oauth_token_secret'),
    };
    axios({
      url: '/php/access_token.php',
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(params)
    })
    .then(function (response) {
      const userDetail = get_access_token(decodeURIComponent(response.data));
      self.loginUser();
      
    }).catch(function (error) {
      self.loginError()
    });
    
  }
  
  componentDidMount = () => {
    if(this.props.location.search && !localStorage.getItem('auth')){
      this.generateToken();
    } else if(this.state.auth){
      this.loginUser();
    }
    else {
      resetData();
    }
  }
  
  render = ()=>{
    const {auth,authError,step_collectData,folders,collectData,selectedFolder,selectedCount,step_action,step_download,step_complete,total,secretKey,userID,apiKey,downloadIndex,imageName,credentional} = this.state
    return(
      <PageWrapper>
        <Console>
          <Line>Cyclotron - Flickr Downloader by Lukasz Stasiak</Line>
          <Line>Welcome my friend...</Line>
          {auth ? 
            <Fragment>
                <Line>Login success</Line>
                <Line>User: {localStorage.getItem('fullname')}</Line>
                
            </Fragment>
          : 
            <Fragment>
                <Line>
                  Flickr Api Key: 
                  <Input right type="text" value={apiKey} onChange={(e) => this.setAuthData(e,'apiKey')}/>
                </Line>
                <Line>
                  Flickr Secret Key: 
                  <Input right type="text" value={secretKey} onChange={(e) => this.setAuthData(e,'secretKey')}/>
                </Line>
                {!authError ? 
                  <Line>
                    <Button onClick={this.connect}>Connect</Button>
                  </Line>
                :
                  <Line>Ups! Something goes wrong, please try check Api Key, Secret Key and try again</Line>
                }
            </Fragment>
          }
          {step_collectData &&
            <Fragment>
              {collectData ?
                <Fragment>
                    <Line>Ok. You have {total} items. I gruped they by date:</Line>
                    <FolderWrapper>
                    {
                       Object.keys(folders).map((key,index)=> (
                          <Folder 
                            key={index}
                            name={folders[key].name}
                            count={folders[key].photos.length}
                            title={folders[key].display}
                            toogleSelection={this.selectFolder}
                            progress={step_action===true}
                          />
                          )
                      )
                    }
                    </FolderWrapper>
                    <Line>Choose which one you want to download</Line>
                    {
                      selectedFolder.length > 0 &&
                      <Fragment>
                        <Line>You selected {selectedFolder.length} folder{ selectedFolder.length > 1 ? 's':''} with {selectedCount} items</Line>
                        {step_action &&
                          <Button onClick={this.download} >Download</Button>
                        }
                      </Fragment>
                    }
                    
                </Fragment>
              :
                <Fragment>
                  <Line>Data calculation...<Loader/></Line>
                </Fragment>
                
              }
            </Fragment>
          }       
          {step_download &&
            <Fragment>
              <Line>
                Progress: {downloadIndex} / {selectedCount} <Loader/>
              </Line>
              <Line>
                Processing item: {imageName}
              </Line>
            </Fragment>
          }
          {step_complete &&
            <Fragment>
              <Line>Download {selectedCount} items success!!!</Line>
              <Line>
                Do you want download something else?
              </Line>
              <Line>
                <Button onClick={this.reset} >Yes</Button>
                <Button onClick={this.credentional} right >No</Button>
              </Line>
            </Fragment>
          }
          {credentional &&
            <Fragment>
              <Line>
                Thank you for using this script.
              </Line>
              <Line>
                All rights reserved Łukasz Stasiak 2019
              </Line>
              <Line>
                You can safely close this card :)
              </Line>
            </Fragment>
          }
        </Console>
      </PageWrapper>

    )
    
  }


}
export default App;