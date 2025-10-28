<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { api } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>{users.map(u => <li key={u.id}>{u.name} ({u.email})</li>)}</ul>
    </div>
  );
=======
import {useEffect,useState} from 'react';
import {api} from './api';
export default function UserList(){
  const [users,setUsers]=useState([]);
  useEffect(()=>{ (async ()=>{
    const {data}=await api.get('/users'); setUsers(data);
  })(); },[]);
  return <ul>{users.map(u=><li key={u.id||u._id}>{u.name} ({u.email})</li>)}</ul>;
>>>>>>> Stashed changes
}
