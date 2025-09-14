import React from "react";
import { createRoot } from "react-dom/client";
import AppContacts from "./App-Contacts";

const root = document.getElementById("root");
if (!root) {
  throw new Error('Root element with id="root" not found');
}
createRoot(root).render(<AppContacts />);
