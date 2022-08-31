import { Navigate, Outlet } from "react-router"

const useAuth = () => {
  const user = Boolean(localStorage.getItem("username"))
  return user
}

const ProtectedRoutes = () => {
  const isAuth = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/" />
}

// const ProtectedRoutes = ({ children }) => {
//   const isAuth = Boolean(localStorage.getItem("username"))
//   if (!isAuth) return <Navigate to="/" />
//   return children
// }

export default ProtectedRoutes