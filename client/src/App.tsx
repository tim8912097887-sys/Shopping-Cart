import { Outlet } from "react-router-dom"
import Header from "@components/Header"
import CheckMe from "@components/CheckMe"
import { Suspense } from "react"
import LoadingSpinner from "@components/LoadingSpinner"
import ErrorBoundary from "@components/ErrorBoundary"

function App() {

  return (
    <>
       <CheckMe>
         <Header/>
         <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner size={25} />}>
              <Outlet/>
            </Suspense>
         </ErrorBoundary>
       </CheckMe>
    </>
  )
}

export default App
