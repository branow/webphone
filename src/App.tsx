import { FC } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PhoneContainer from './components/PhoneContainer'
import Phone from './components/Phone'
import './App.css'

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <PhoneContainer>
          <Phone />
        </PhoneContainer>
      </div>
    </QueryClientProvider>
  )
}

export default App
