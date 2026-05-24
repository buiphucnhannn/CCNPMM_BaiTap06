import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../redux/slices/productSlice'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi'

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { products, loading, loadingMore, pagination } = useSelector((state) => state.product)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [expandedSections, setExpandedSections] = useState({ category: true, brand: true, price: true })
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get('page') || '1'))
  const loadMoreRef = useRef(null)

  const keyword = searchParams.get('keyword') || ''
  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [localMinPrice, setLocalMinPrice] = useState(minPrice)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice)

  const filterKey = useMemo(
    () => JSON.stringify({ keyword, category, brand, sort, minPrice, maxPrice }),
    [keyword, category, brand, sort, minPrice, maxPrice],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [filterKey])

  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword,
        category,
        brand,
        sort,
        page: currentPage,
        limit: 12,
        minPrice,
        maxPrice,
        append: currentPage > 1,
      }),
    )
  }, [dispatch, keyword, category, brand, sort, currentPage, minPrice, maxPrice])

  useEffect(() => {
    setLocalMinPrice(minPrice)
    setLocalMaxPrice(maxPrice)
  }, [minPrice, maxPrice])

  useEffect(() => {
    setSearchInput(keyword)
  }, [keyword])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (!firstEntry.isIntersecting || loading || loadingMore || !pagination.hasMore) return
        setCurrentPage((prev) => prev + 1)
      },
      { rootMargin: '180px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [loading, loadingMore, pagination.hasMore])

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const handleSortChange = (newSort) => updateParams({ sort: newSort })
  const handleCategoryChange = (newCat) => updateParams({ category: newCat })
  const handleBrandChange = (newBrand) => updateParams({ brand: newBrand === brand ? '' : newBrand })

  const handlePriceFilter = () => {
    updateParams({ minPrice: localMinPrice, maxPrice: localMaxPrice })
  }

  const handlePriceInputChange = (setter) => (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '')
    setter(onlyDigits)
  }

  const preventNumberInputJump = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const handleClearFilters = () => {
    setLocalMinPrice('')
    setLocalMaxPrice('')
    setSearchInput('')
    setSearchParams({ sort: 'newest' })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('page')
    if (searchInput.trim()) {
      newParams.set('keyword', searchInput.trim())
    } else {
      newParams.delete('keyword')
    }
    setSearchParams(newParams)
  }

  const clearSearch = () => {
    setSearchInput('')
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('keyword')
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const hasActiveFilters = category || brand || minPrice || maxPrice

  const categories = [
    { value: '', label: 'Tất cả' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'running', label: 'Chạy bộ' },
    { value: 'basketball', label: 'Bóng rổ' },
    { value: 'skateboarding', label: 'Skateboard' },
    { value: 'training', label: 'Training' },
  ]

  const brands = ['Nike', 'Adidas', 'Jordan', 'Converse', 'Puma', 'New Balance']

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
    { value: 'best_seller', label: 'Bán chạy' },
  ]

  const priceRanges = [
    { label: 'Dưới 1 triệu', min: '', max: '1000000' },
    { label: '1 - 3 triệu', min: '1000000', max: '3000000' },
    { label: '3 - 5 triệu', min: '3000000', max: '5000000' },
    { label: 'Trên 5 triệu', min: '5000000', max: '' },
  ]

  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Đang lọc</h3>
            <button onClick={handleClearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
              Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {category && (
              <span className="inline-flex items-center gap-1 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {categories.find((c) => c.value === category)?.label}
                <button onClick={() => updateParams({ category: '' })}><FiX className="text-xs" /></button>
              </span>
            )}
            {brand && (
              <span className="inline-flex items-center gap-1 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {brand}
                <button onClick={() => updateParams({ brand: '' })}><FiX className="text-xs" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {minPrice && maxPrice
                  ? `${(+minPrice / 1000000).toFixed(0)} - ${(+maxPrice / 1000000).toFixed(0)} tr`
                  : minPrice
                    ? `Từ ${(+minPrice / 1000000).toFixed(0)} tr`
                    : `Đến ${(+maxPrice / 1000000).toFixed(0)} tr`}
                <button onClick={() => { setLocalMinPrice(''); setLocalMaxPrice(''); updateParams({ minPrice: '', maxPrice: '' }) }}><FiX className="text-xs" /></button>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="border-b border-gray-100 pb-5">
        <button onClick={() => toggleSection('category')} className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3">
          Danh mục {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.category && (
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  category === cat.value
                    ? 'bg-black text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-gray-100 pb-5">
        <button onClick={() => toggleSection('brand')} className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3">
          Thương hiệu {expandedSections.brand ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.brand && (
          <div className="space-y-1.5">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => handleBrandChange(b)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  brand === b
                    ? 'bg-black text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3">
          Khoảng giá {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    setLocalMinPrice(range.min)
                    setLocalMaxPrice(range.max)
                    updateParams({ minPrice: range.min, maxPrice: range.max })
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    minPrice === range.min && maxPrice === range.max
                      ? 'bg-black text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Tùy chỉnh (VND):</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Từ"
                  value={localMinPrice}
                  onChange={handlePriceInputChange(setLocalMinPrice)}
                  onKeyDown={preventNumberInputJump}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Đến"
                  value={localMaxPrice}
                  onChange={handlePriceInputChange(setLocalMaxPrice)}
                  onKeyDown={preventNumberInputJump}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
              <button
                onClick={handlePriceFilter}
                className="w-full mt-2 bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {keyword ? `Kết quả: "${keyword}"` : 'Tất cả sản phẩm'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{pagination.total || 0} sản phẩm</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-xs text-gray-500 hover:text-black font-medium"
                >
                  Xóa
                </button>
              )}
              <button
                type="submit"
                className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-900"
              >
                Tìm
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
            >
              <FiFilter /> Bộ lọc {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-black"></span>}
            </button>

            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400 hidden md:block" />
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-black cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="hide-scrollbar bg-white rounded-2xl shadow-sm border border-gray-100 p-5 max-h-[calc(100vh-110px)] overflow-y-auto">
              <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                <FiFilter className="text-gray-400" /> Bộ lọc
              </h2>
              {renderFilterSidebar()}
            </div>
          </aside>

          {showFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto animate-slide-in-left">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800">Bộ lọc</h2>
                  <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <FiX className="text-xl" />
                  </button>
                </div>
                <div className="p-5">
                  {renderFilterSidebar()}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-2">Không tìm thấy sản phẩm nào</p>
                <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                {hasActiveFilters && (
                  <button onClick={handleClearFilters} className="mt-4 text-sm text-black font-semibold underline">
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 -mt-4 md:-mt-5">
                  {products.map((product, i) => (
                    <div key={`${product._id}-${i}`} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                <div ref={loadMoreRef} className="h-12" />

                {loadingMore && (
                  <div className="py-6 text-center text-sm text-gray-500">Đang tải thêm sản phẩm...</div>
                )}

                {!pagination.hasMore && products.length > 0 && (
                  <div className="py-6 text-center text-sm text-gray-400">Đã hiển thị tất cả sản phẩm</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
