import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomeData, fetchHomeRanking } from '../redux/slices/productSlice'
import HeroBanner from '../components/HeroBanner'
import ProductSection from '../components/ProductSection'
import HomeRankSection from '../components/HomeRankSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiX } from 'react-icons/fi'

const PAGE_SIZE_HOME = 4

const HomePage = () => {
  const dispatch = useDispatch()
  const { homeData, homeRankings, loading } = useSelector((state) => state.product)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const [rankDirection, setRankDirection] = useState({
    best_seller: 'next',
    most_viewed: 'next',
  })

  const [homePageState, setHomePageState] = useState({
    sale: { page: 1, direction: 'next' },
    newest: { page: 1, direction: 'next' },
  })
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true)

  useEffect(() => {
    dispatch(fetchHomeData())
    dispatch(fetchHomeRanking({ type: 'best_seller', page: 1, limit: 4 }))
    dispatch(fetchHomeRanking({ type: 'most_viewed', page: 1, limit: 4 }))
  }, [dispatch])

  const saleTotalPages = Math.max(Math.ceil((homeData.saleProducts?.length || 0) / PAGE_SIZE_HOME), 1)
  const newestTotalPages = Math.max(Math.ceil((homeData.newestProducts?.length || 0) / PAGE_SIZE_HOME), 1)

  const salePageProducts = useMemo(() => {
    const start = (homePageState.sale.page - 1) * PAGE_SIZE_HOME
    return (homeData.saleProducts || []).slice(start, start + PAGE_SIZE_HOME)
  }, [homeData.saleProducts, homePageState.sale.page])

  const newestPageProducts = useMemo(() => {
    const start = (homePageState.newest.page - 1) * PAGE_SIZE_HOME
    return (homeData.newestProducts || []).slice(start, start + PAGE_SIZE_HOME)
  }, [homeData.newestProducts, homePageState.newest.page])

  const handleHomeSectionPage = (type, nextPage, direction, totalPages) => {
    if (nextPage < 1 || nextPage > totalPages) return
    setHomePageState((prev) => ({
      ...prev,
      [type]: { page: nextPage, direction },
    }))
  }

  const handleRankingPageChange = (type, nextPage, direction) => {
    const ranking = homeRankings[type]
    if (!ranking) return
    if (nextPage < 1 || nextPage > ranking.totalPages) return
    setRankDirection((prev) => ({ ...prev, [type]: direction }))
    dispatch(fetchHomeRanking({ type, page: nextPage, limit: 4 }))
  }

  return (
    <div className="min-h-screen bg-white">
      {isAuthenticated && showWelcomeBanner && (
        <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-r from-black via-gray-900 to-black text-white py-2.5 text-center text-sm font-medium">
          <span className="relative z-10">
            Chào mừng <strong>{user?.fullName}</strong> quay trở lại | Vai trò:{' '}
            <strong>{user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</strong>
          </span>
          <button
            onClick={() => setShowWelcomeBanner(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border border-white/20 hover:bg-white/10 inline-flex items-center justify-center transition-colors"
            aria-label="Đóng thông báo chào mừng"
          >
            <FiX />
          </button>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_50%,rgba(255,255,255,0.3),transparent_38%),radial-gradient(circle_at_85%_50%,rgba(255,255,255,0.2),transparent_40%)]" />
        </div>
      )}

      <HeroBanner />

      {loading ? (
        <LoadingSpinner text="Đang tải sản phẩm..." />
      ) : (
        <>
          <ProductSection
            title="Khuyến mãi hot"
            subtitle="Ưu đãi nổi bật, số lượng có hạn."
            products={salePageProducts}
            linkTo="/products?sort=sale"
            bgColor="bg-gradient-to-b from-gray-50 to-white"
            paginated
            page={homePageState.sale.page}
            totalPages={saleTotalPages}
            slideDirection={homePageState.sale.direction}
            onPrev={() => handleHomeSectionPage('sale', homePageState.sale.page - 1, 'prev', saleTotalPages)}
            onNext={() => handleHomeSectionPage('sale', homePageState.sale.page + 1, 'next', saleTotalPages)}
          />

          <HomeRankSection
            title="Top 10 bán chạy nhất"
            subtitle="Dựa trên tổng số lượng bán ra."
            products={homeRankings.best_seller.products}
            page={homeRankings.best_seller.page}
            totalPages={homeRankings.best_seller.totalPages}
            loading={homeRankings.best_seller.loading}
            slideDirection={rankDirection.best_seller}
            onPrev={() => handleRankingPageChange('best_seller', homeRankings.best_seller.page - 1, 'prev')}
            onNext={() => handleRankingPageChange('best_seller', homeRankings.best_seller.page + 1, 'next')}
            linkTo="/products?sort=best_seller"
            bgColor="bg-white"
          />

          <HomeRankSection
            title="Top 10 xem nhiều nhất"
            subtitle="Lượt xem 7 ngày gần nhất."
            products={homeRankings.most_viewed.products}
            page={homeRankings.most_viewed.page}
            totalPages={homeRankings.most_viewed.totalPages}
            loading={homeRankings.most_viewed.loading}
            slideDirection={rankDirection.most_viewed}
            onPrev={() => handleRankingPageChange('most_viewed', homeRankings.most_viewed.page - 1, 'prev')}
            onNext={() => handleRankingPageChange('most_viewed', homeRankings.most_viewed.page + 1, 'next')}
            linkTo="/products?sort=newest"
            bgColor="bg-gradient-to-b from-gray-50 to-white"
          />

          <ProductSection
            title="Mới nhất"
            subtitle="Cập nhật mới nhất, lên kệ mỗi ngày."
            products={newestPageProducts}
            linkTo="/products?sort=newest"
            bgColor="bg-white"
            paginated
            page={homePageState.newest.page}
            totalPages={newestTotalPages}
            slideDirection={homePageState.newest.direction}
            onPrev={() => handleHomeSectionPage('newest', homePageState.newest.page - 1, 'prev', newestTotalPages)}
            onNext={() => handleHomeSectionPage('newest', homePageState.newest.page + 1, 'next', newestTotalPages)}
          />

          <section className="py-16 bg-[#0f1115] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ffffff,transparent_30%),radial-gradient(circle_at_80%_80%,#9ca3af,transparent_40%)]" />
            <div className="max-w-7xl mx-auto px-4 relative">
              <h2 className="text-3xl font-bold text-center mb-3">Tại sao chọn Sneaker Store?</h2>
              <p className="text-gray-300 text-center max-w-2xl mx-auto mb-10">Cam kết trải nghiệm mua sắm rõ ràng, minh bạch và nhanh chóng cho mọi đơn hàng.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: '✅', title: 'Chính hãng 100%', desc: 'Cam kết sản phẩm chính hãng từ các thương hiệu lớn trên thế giới.' },
                  { icon: '🚚', title: 'Giao hàng nhanh', desc: 'Giao hàng toàn quốc trong 2-5 ngày. Miễn phí cho đơn trên 2 triệu.' },
                  { icon: '🔄', title: 'Đổi trả dễ dàng', desc: 'Đổi trả miễn phí trong 30 ngày nếu sản phẩm lỗi hoặc không vừa.' },
                ].map((feature, i) => (
                  <div key={i} className="text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/15 backdrop-blur-sm">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default HomePage
