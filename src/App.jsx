import { useState } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { AuthWrapper } from "./components/auth/authWrapper";

function App() {
  return (
    <>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </>
  );
}

export default App;
