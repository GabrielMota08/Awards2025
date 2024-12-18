import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'

function App() {

  return (
    <div className="App">
      <Navbar/>
      <div className="outlet-container">
        <h2 id="outlet"><Outlet/></h2>
      </div>
    </div>
  )
}

export default App
