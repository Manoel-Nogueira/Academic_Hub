import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
