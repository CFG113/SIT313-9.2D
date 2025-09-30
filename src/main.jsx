import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { UserProvider } from "./context/user.context";
import { TutorialsProvider } from "./context/tutorials.context";
import { QuestionsProvider } from "./context/Questions.context";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Theme>
      <QuestionsProvider>
        <BrowserRouter>
          <UserProvider>
            <TutorialsProvider>
              <App />
            </TutorialsProvider>
          </UserProvider>
        </BrowserRouter>
      </QuestionsProvider>
    </Theme>
  </StrictMode>
);
