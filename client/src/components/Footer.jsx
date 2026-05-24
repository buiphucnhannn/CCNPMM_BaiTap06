import { FiShoppingBag, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4"><FiShoppingBag className="text-2xl text-white" /><span className="text-xl font-bold text-white">SNEAKER STORE</span></Link>
            <p className="text-sm text-gray-400 leading-relaxed">Cửa hàng giày sneaker chính hãng.</p>
          </div>
          <div><h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3></div>
          <div><h3 className="text-white font-semibold mb-4">Thương hiệu</h3></div>
          <div><h3 className="text-white font-semibold mb-4">Liên hệ</h3><ul className="space-y-3 text-sm"><li className="flex items-center gap-2"><FiMapPin className="text-white shrink-0" /><span>TP.HCM</span></li><li className="flex items-center gap-2"><FiPhone className="text-white shrink-0" /><span>036 207 3xxx</span></li><li className="flex items-center gap-2"><FiMail className="text-white shrink-0" /><span>23110278@student.hcmute.edu.vn</span></li></ul></div>
        </div>
      </div>
      <div className="border-t border-gray-800"><div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">© 2026 Sneaker Store. All rights reserved.</div></div>
    </footer>
  )
}

export default Footer
