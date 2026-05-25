import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import heroImage from '../assets/hero.png'

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-[radial-gradient(circle_at_20%_20%,#f3f4f6,transparent_32%),radial-gradient(circle_at_80%_10%,#e5e7eb,transparent_35%),linear-gradient(160deg,#ffffff_0%,#f9fafb_45%,#f3f4f6_100%)]">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full border border-gray-300/70" />
        <div className="absolute top-24 right-[-70px] w-80 h-80 rounded-full border border-gray-300/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="text-center md:text-left animate-slide-in-left">
            <div className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-gray-200 shadow-sm">
              Bộ sưu tập mới 2026
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.08] mb-4">
              Mang Chất Riêng
              <br />
              <span className="text-gray-500">Trong Từng Bước Chân</span>
            </h1>

            <p className="text-gray-600 text-lg mb-7 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Khám phá bộ sưu tập sneaker chính hãng từ Nike, Adidas, Jordan, Converse và nhiều thương hiệu hàng đầu khác.
            </p>

            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              <Link
                to="/products"
                className="bg-black hover:bg-gray-900 text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-black/20 flex items-center gap-2 group"
              >
                Mua ngay
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?sort=newest"
                className="border border-gray-300 bg-white text-gray-900 px-7 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-all"
              >
                Xem mới nhất
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 max-w-md mx-auto md:mx-0">
              {[
                { value: '500+', label: 'Sản phẩm' },
                { value: '6', label: 'Thương hiệu' },
                { value: '10K+', label: 'Khách hàng' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-200 bg-white/90 px-3 py-3 text-center shadow-sm">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in-up">
            <div className="absolute inset-0 m-auto w-[82%] h-[82%] rounded-full bg-gray-300/30 blur-3xl" />
            <div className="relative rounded-[2rem] border border-gray-200 bg-white/70 backdrop-blur-sm p-4 md:p-6 shadow-xl">
              <img
                src={heroImage}
                alt="Sneaker nổi bật"
                className="w-full max-w-sm md:max-w-md mx-auto drop-shadow-2xl transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
