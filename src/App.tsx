import { FC } from 'react'
import PhoneContainer from './components/PhoneContainer'
import Phone from './components/Phone'
import './App.css'

const App: FC = () => {
  return (
    <div className="app">
      <PhoneContainer>
        <Phone />
      </PhoneContainer>
    </div>
  )
}

export default App
