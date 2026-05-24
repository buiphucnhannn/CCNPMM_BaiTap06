import { Link } from 'react-router-dom'
import { FiTag, FiTrendingUp } from 'react-icons/fi'

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const ProductCard = ({ product }) => {
  const hasSale = product.salePrice && product.salePrice < product.price
  const discountPercent = hasSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const tags = Array.isArray(product.tags) ? product.tags : []
  const uniqueTags = Array.from(new Set(tags))
  const filteredTags = hasSale ? uniqueTags.filter((tag) => tag !== 'sale') : uniqueTags
  const tagPriority = ['sale', 'best-seller', 'new', 'limited']
  const orderedTags = [
    ...tagPriority.filter((tag) => filteredTags.includes(tag)),
    ...filteredTags.filter((tag) => !tagPriority.includes(tag)),
  ]
  const visibleTags = orderedTags.slice(0, 2)
  const hiddenCount = Math.max(orderedTags.length - visibleTags.length, 0)

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=Sneaker'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Sneaker'
          }}
        />

        {hasSale && (
          <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse-glow">
            -{discountPercent}%
          </div>
        )}

        {visibleTags.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  tag === 'sale'
                    ? 'bg-red-100 text-red-700'
                    : tag === 'new'
                      ? 'bg-emerald-100 text-emerald-700'
                      : tag === 'best-seller'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-800 text-white'
                }`}
              >
                {tag === 'sale'
                  ? 'Giảm giá'
                  : tag === 'new'
                    ? 'Mới'
                    : tag === 'best-seller'
                      ? 'Bán chạy'
                      : tag}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-800 text-white">
                +{hiddenCount}
              </span>
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
            Xem chi tiết
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-black transition-colors">{product.name}</h3>

        <div className="flex items-center gap-2">
          {hasSale ? (
            <>
              <span className="text-black font-bold text-lg">{formatPrice(product.salePrice)}</span>
              <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-gray-800 font-bold text-lg">{formatPrice(product.price)}</span>
          )}
        </div>

        {product.soldCount > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <FiTrendingUp className="text-gray-700" />
            <span>Đã bán {product.soldCount}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
