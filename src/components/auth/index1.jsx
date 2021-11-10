import React, { useState, useEffect, Component } from 'react';
import { isLogin} from '../../pages/login/service';
import { Redirect } from 'umi';

class Auth extends Component{
  state={
    user:null
  };
  ifLogin=async()=>{
    var res=await isLogin();
    this.setState({
      user:res.data.data
    })
  }
  componentDidMount() {
   this.ifLogin();
  }
  render(){
     const {user}=this.state;
     //if(!user){
      return (<div>{this.props.children}</div>)
     //}else{
      //return <Redirect to="/login" />;
     //}
  } 
}

export default Auth;