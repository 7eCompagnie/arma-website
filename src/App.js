import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/operations/Register";
import Formations from "./pages/formations/Formations";
import SingleOperation from "./pages/operations/Single";
import SingleFormation from "./pages/formations/Single";
import Create from "./pages/operations/Create";

function App() {
  return (<>
      <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/operations/register" element={<Register />}/>
          <Route path="/operations/operation-bosso" element={<SingleOperation />}/>
          <Route path="/operations/create" element={<Create />}/>
          <Route path="/formations" element={<Formations />}/>
          <Route path="/formations/pilote-helico" element={<SingleFormation />}/>
      </Routes>
  </>);
}

export default App;
