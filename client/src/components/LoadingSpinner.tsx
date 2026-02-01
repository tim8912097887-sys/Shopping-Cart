type Props = {
  size: number
}

const LoadingSpinner = ({ size }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <div data-testid="spinner" style={{ height: `${size}px`, width: `${size}px` }} className={`animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent`}></div>
    </div>
  )
}

export default LoadingSpinner