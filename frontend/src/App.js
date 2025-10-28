import {useState} from 'react';
import UserList from './UserList'; import AddUser from './AddUser';
export default function App(){
  const [v,setV]=useState(0);
  return (<div style={{padding:16}}>
    <AddUser onAdded={()=>setV(x=>x+1)} />
    <hr/>
    <UserList key={v} />
  </div>);
}
