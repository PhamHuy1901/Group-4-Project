import { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

export default function App() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div style={{ padding: 16 }}>
      <AddUser onAdded={() => setRefresh(r => r + 1)} />
      <hr />
      <UserList key={refresh} />
    </div>
  );
}
