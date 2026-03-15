import "./UserBar.css";

function UserBar({ user, onLogout }) {
  return (
    <div className="user-bar">
      <div className="user-info">
        <p className="user-greeting">Logged in as</p>
        <h3>{user?.name}</h3>
        <span>{user?.email}</span>
      </div>

      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default UserBar;