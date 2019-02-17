import React from 'react';
import styled from 'styled-components';

const FolderBox = styled.div`
  color:#5fb7d4;
  border:1px solid #5fb7d4;
  padding:5px 10px;
  cursor:pointer;
  display:flex;
  flex-direction:column;
  width:calc(20% - 10px);
  margin:5px;
  box-sizing:border-box;
  position:relative;
  background-color:${p => p.select ? 'rgba(127, 209, 228, 0.46)': 'transparent'}
`;

const FolderBox_Title = styled.div`
  font-size:16px;
`
const FolderBox_Count = styled.div`
  font-size:14px;
`
const FolderBox_Icon = styled.i`
  position:absolute;
  width:16px;
  height:16px;
  top:5px;
  right:5px;
  font-size:16px;
`
class Folder extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      status:localStorage.getItem(props.name),
      selected:false,
      name: props.name,
      count: props.count,
      display:props.title,
    }
  }
  toogleSelection() {
    if(this.props.progress){
      const select = !this.state.selected
      this.props.toogleSelection(this.props.name)
      this.setState({
        selected:select
      })
    }
  }
  componentDidUpdate = ()=>{
    if((localStorage.getItem(this.state.name) != this.state.status)){
       if((localStorage.getItem(this.state.name) === 'downloaded')){
        this.setState({
          selected:false,
          status:localStorage.getItem(this.state.name)
        })
       } else if(localStorage.getItem(this.state.name) ==='inprogress'){
          this.setState({
            status:localStorage.getItem(this.state.name)
          })
        }
       }
  }
  render = () =>{
    const {selected,status,count,display} = this.state;
    return(
      <FolderBox select={selected} onClick={(e)=>(this.toogleSelection(e))}>
        <FolderBox_Title>{display}</FolderBox_Title>
        <FolderBox_Count>{count} items</FolderBox_Count>
        { status=="downloaded" &&
          <FolderBox_Icon className="material-icons" title="Already downloaded">
            check_circle
          </FolderBox_Icon>
        }
        
      </FolderBox>
    )
  }
}

export default Folder;