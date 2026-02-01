import { Outlet } from "react-router-dom"
import Header from "@components/Header"
import CheckMe from "@components/CheckMe"
import { Suspense } from "react"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {

  return (
    <>
       <CheckMe>
         <Header/>
         <Suspense fallback={<LoadingSpinner size={25} />}>
           <Outlet/>
         </Suspense>
       </CheckMe>
    </>
  )
}

export default App
