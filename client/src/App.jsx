import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import { useContext, useEffect } from 'react';
import AppContext from './context/AppContext';
import bgPurple from "./assets/Frame_16.png";
import bgBlue from "./assets/Frame_4.png";


function App() {
  const { menuOpen, themeBg } = useContext(AppContext);

  useEffect(() => {
    const backgrounds = {
      Purple: bgPurple,
      Blue: bgBlue,
    };

    const selectedBg = backgrounds[themeBg] || backgrounds.Purple;

    document.body.style.backgroundImage = `url(${selectedBg})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center top";
    document.body.style.backgroundSize = "100% auto";

  }, [themeBg]);

  return (
    <div className="App">
      <Navbar/>
      <div className="outlet-container">
        <h2 id="outlet" className={!menuOpen && "menuOpenOutlet"}>
          <Outlet/>
        </h2>
      </div>
    </div>
  )
}

export default App;
