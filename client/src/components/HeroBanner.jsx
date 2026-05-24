import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import heroImage from '../assets/hero.png'

const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden border-b border-gray-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gray-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gray-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left animate-slide-in-left">
            <div className="inline-block bg-black/10 text-black text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-gray-300">
              🔥 Bộ sưu tập mới 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
              Bước Đi <br />
              <span className="gradient-text">Phong Cách</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto md:mx-0">
              Khám phá bộ sưu tập sneaker chính hãng từ các thương hiệu hàng đầu thế giới.
              Nike, Adidas, Jordan, Converse và nhiều hơn nữa.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-black/20 flex items-center gap-2 group"
              >
                Mua ngay
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?sort=newest"
                className="border border-gray-400 text-gray-900 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-all"
              >
                Xem mới nhất
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center md:justify-start">
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-500">Sản phẩm</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-sm text-gray-500">Thương hiệu</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-500">Khách hàng</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-in-up">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Featured Sneaker"
                className="w-full max-w-lg mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 -rotate-12"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-400/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
