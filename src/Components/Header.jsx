const Header = () => {
  return (
    <header className="header">
      <a className="logo-wrap" href="/" aria-label="A.T.O.M home">
        <div className="logo-mark">A</div>
        <span className="logo-text">A.T.O.M</span>
      </a>
      <a className="nav-button" href="/login">Log in</a>
    </header>
  )
}

export default Header