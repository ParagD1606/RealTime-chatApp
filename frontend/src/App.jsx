import { useEffect } from "react";
import api from "./services/api";

function App() {

  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        console.log("Success:", res.data);
      })
      .catch(err => {
        console.log("Error:", err.response?.data || err.message);
      });
  }, []);

  return (
    <h1>Chat App</h1>
  );
}

export default App;
