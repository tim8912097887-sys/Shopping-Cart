
const ErrorFallback = ({ handleReset }: { handleReset: () => void }) => {
  return (
    <div className="error-container">
        <h1>Application Error</h1>
        <p>We're having some trouble loading this section.</p>
        <button onClick={() => {
           handleReset();
        }}>Go Back</button>
    </div>
  )
}

export default ErrorFallback