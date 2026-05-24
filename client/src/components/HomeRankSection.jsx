import ProductCard from './ProductCard'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const HomeRankSection = ({
  title,
  subtitle,
  icon,
  products,
  page,
  totalPages,
  loading,
  slideDirection = 'next',
  onPrev,
  onNext,
  linkTo,
  bgColor = 'bg-white',
}) => {
  const slideClass = slideDirection === 'prev' ? 'animate-slide-in-from-left' : 'animate-slide-in-from-right'

  return (
    <section className={`py-12 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
              {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
            </div>
          </div>
          {linkTo && (
            <Link to={linkTo} className="flex items-center gap-1 text-black hover:text-gray-700 font-semibold text-sm transition-colors group">
              Xem tất cả
              <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <>
          <div key={`${title}-${page}-${slideDirection}`} className={slideClass}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={onPrev}
              disabled={loading || page <= 1}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 inline-flex items-center justify-center"
              aria-label="Trang trước"
            >
              <FiChevronLeft />
            </button>
            <span className="text-sm text-gray-500 font-semibold">&lt; {page} / {totalPages} &gt;</span>
            <button
              onClick={onNext}
              disabled={loading || page >= totalPages}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 inline-flex items-center justify-center"
              aria-label="Trang sau"
            >
              <FiChevronRight />
            </button>
          </div>
        </>
      </div>
    </section>
  )
}

export default HomeRankSection
