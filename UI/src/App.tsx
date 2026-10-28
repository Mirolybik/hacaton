import { useState } from "react";
import { clearUser, loadUser, logout } from "./api";
import LoginPage from "./pages/LoginPage";
import RequestsPage from "./pages/RequestsPage";

function App() {
  const [user, setUser] = useState(loadUser());
  const [openId, setOpenId] = useState(null as string | null);

  if (!user) {
    return <LoginPage onDone={setUser} />;
  }

  const handleBye = async () => {
    await logout();
    clearUser();
    setUser(null);
  };

  return (
    <RequestsPage
      user={user}
      openId={openId}
      onOpen={setOpenId}
      onBye={handleBye}
    />
  );
}

export default App;
