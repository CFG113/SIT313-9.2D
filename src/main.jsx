import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { UserProvider } from "./context/user.context";
import { TutorialsProvider } from "./context/tutorials.context";
import { QuestionsProvider } from "./context/questions.context";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/theme.context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Theme>
      <ThemeProvider>
        <QuestionsProvider>
          <BrowserRouter>
            <UserProvider>
              <TutorialsProvider>
                <App />
              </TutorialsProvider>
            </UserProvider>
          </BrowserRouter>
        </QuestionsProvider>
      </ThemeProvider>
    </Theme>
  </StrictMode>
);
