import { Redirect } from 'umi';
import { isLogin} from '../../pages/login/service';
var res={};
/* const getAuth=async()=>{
  var res=await isLogin();
  return res
} */
const authData=()=>{
  /* var a=getAuth().then(res=>{
   return res
  })
  console.log(a,'a') */
}
export default (props: any) => {
 /*  getAuth().then(res=>{
   
    console.log(props)
    return <div>{props.children}</div>;
  }) */
  //console.log(a,props)
  const token = window.localStorage.getItem('token');
  if (token) {
    return <div>{props.children}</div>;
  } else {
    return <Redirect to="/login" />;
  } 
};
