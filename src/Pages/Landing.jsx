import Header from '../Components/Header'

const stats = [
  { value: '2.2x', label: 'faster delivery' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '24/7', label: 'AI support' },
]

const Landing = () => {
  return (
    <div className="landing-page">
      <Header />

      <main className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">NEXT-GEN SHOPPING</span>
          <h1>Find your desired products </h1>
          <p>
           Always working to improve the quality of our products and services. We are committed to providing our customers with the best possible experience, and we are constantly looking for ways to enhance our offerings.
          </p>

          <div className="hero-actions">
            <a className="primary-btn" href="/signup">Get started</a>
           
          </div>

          <div className="trust-row">
            {stats.map((item) => (
              <div key={item.label} className="stat-pill">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-card">
            <img src="https://cdn.pixabay.com/photo/2024/05/07/00/39/schedule-8744592_1280.png"alt="AI dashboard preview" />
          </div>
        
        </div>
      </main>

     
    </div>
  )
}

export default Landing