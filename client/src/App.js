import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './Routes/Home/Home';
import Auth from './Routes/Auth/Auth';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/auth/*" element = {<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
