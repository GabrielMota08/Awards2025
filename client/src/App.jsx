import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import { useContext } from 'react';
import AppContext from './context/AppContext';

function App() {
  const {menuOpen} = useContext(AppContext);
  return (
    <div className="App">
      <Navbar/>
      <div className="outlet-container">
        <h2 id="outlet" className={!menuOpen && "menuOpenOutlet"}><Outlet/></h2>
      </div>
    </div>
  )
}

export default App
