import type { RootState } from "@/stores/store"
import { BsFillPersonFill } from "react-icons/bs"
import { FaCartPlus } from "react-icons/fa"
import { useSelector } from "react-redux"
import { Link, NavLink } from "react-router-dom"

const Header = () => {

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
           {/* Branding */}
           <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold tracking-tight text-blue-600">Amazon</h1>
              {/* Primary navigation */}
              <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                <NavLink className={({ isActive }) => (isActive?"text-gray-400":"hover:text-blue-600")} to="/">Shop</NavLink>
                <NavLink className={({ isActive }) => (isActive?"text-gray-400":"hover:text-blue-600")} to="/deals">Deals</NavLink>
              </nav>
           </div>
           {/* User Auth */}
           <div className="flex items-center gap-5">
             <div className="flex items-center gap-2">
                {
                  accessToken?
                   <Link to="/profile">
                     <BsFillPersonFill className="border-2 w-6 h-6 rounded-full" />
                   </Link>
                  :
                  <>
                   <Link className="hover:text-blue-600" to="/login">Login</Link>
                    <span>|</span>
                   <Link className="hover:text-blue-600" to="/signup">Signup</Link> 
                  </>
                }
             </div>
             <Link to="/cart">
               <FaCartPlus className="text-2xl" />
             </Link>
           </div>
        </div>
    </header>
  )
}

export default Header