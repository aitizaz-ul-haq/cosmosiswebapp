"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // user = { username: "admin", role: "admin" }

  const login = (username, password) => {
    // Fake users for now (replace with API later)
    const users = [
      { username: "admin", password: "1234", role: "admin" },
      { username: "supervisor", password: "1234", role: "supervisor" },
      { username: "rm", password: "1234", role: "rm" },
      { username: "client", password: "1234", role: "client" },
    ];

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
