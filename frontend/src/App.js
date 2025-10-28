import "./styles.css";
import UserList from "./UserList";

export default function App() {
  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>User Manager</h1>
        </div>
        <UserList />
      </div>
    </div>
  );
}
