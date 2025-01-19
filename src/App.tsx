import { FC } from 'react'
import PhoneContainer from './components/PhoneContainer'
import SipProvider from './components/account/SipProvider'
import Phone from './components/Phone'
import './App.css'

const App: FC = () => {
  return (
    <div className="app">
      <SipProvider>
        <PhoneContainer>
          <Phone />
        </PhoneContainer>
      </SipProvider>
    </div>
  )
}

export default App
