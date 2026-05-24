import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiUser, FiLogOut, FiMenu, FiX, FiShoppingBag, FiShoppingCart } from 'react-icons/fi'
import { logoutUser } from '../redux/slices/authSlice'
import { fetchCart } from '../redux/slices/cartSlice'
import { toast } from 'react-toastify'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [dispatch, isAuthenticated])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Đăng xuất thành công!')
    navigate('/')
    setUserMenuOpen(false)
    setMenuOpen(false)
  }

  return (
    <header className="bg-white text-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-8">
        <div className="relative h-[74px] flex items-center gap-4">
          <Link to="/" className="shrink-0 flex items-center gap-2.5 group">
            <FiShoppingBag className="text-2xl text-black" />
            <span className="text-[30px] font-bold tracking-tight leading-none">
              <span className="text-black">SNEAKER</span>
              <span className="text-gray-700"> STORE</span>
            </span>
          </Link>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <nav className="flex items-center gap-8">
              <Link to="/products" className="text-gray-700 hover:text-black transition-colors font-medium">Bộ sưu tập</Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center ml-auto gap-3">
            <Link
              to={isAuthenticated ? '/cart' : '/login'}
              className="relative w-11 h-11 rounded-full border border-gray-200 hover:border-gray-300 inline-flex items-center justify-center text-gray-700 hover:text-black transition-colors"
              aria-label="Giỏ hàng"
            >
              <FiShoppingCart />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="h-11 flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 rounded-full transition-all text-sm font-medium"
                >
                  <FiUser />
                  <span className="max-w-[140px] truncate">{user?.fullName || 'Tài khoản'}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FiUser className="text-gray-400" /> Thông tin cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 transition-colors w-full"
                    >
                      <FiLogOut className="text-gray-500" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 hover:text-black transition-colors font-medium">
                  Đăng nhập
                </Link>
                <Link to="/register" className="h-11 inline-flex items-center bg-black hover:bg-gray-900 text-white px-5 rounded-full transition-all font-semibold">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl p-1">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 pt-4 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <Link to="/products" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-gray-100 transition-colors">Bộ sưu tập</Link>

              {isAuthenticated ? (
                <>
                  <Link to="/cart" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiShoppingCart className="inline mr-2" /> Giỏ hàng
                    {totalItems > 0 && <span className="ml-2 text-xs text-gray-500">({totalItems})</span>}
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiUser className="inline mr-2" /> {user?.fullName}
                  </Link>
                  <button onClick={handleLogout} className="text-left py-2.5 px-3 rounded-lg hover:bg-gray-100 text-gray-800 transition-colors">
                    <FiLogOut className="inline mr-2" /> Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-lg hover:bg-gray-100 transition-colors">Đăng nhập</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-lg bg-black hover:bg-gray-900 text-white text-center transition-colors">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
