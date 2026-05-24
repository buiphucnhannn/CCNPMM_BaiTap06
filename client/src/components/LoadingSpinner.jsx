const LoadingSpinner = ({ size = 'md', text = 'Đang tải...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-black rounded-full animate-spin`}></div>
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
