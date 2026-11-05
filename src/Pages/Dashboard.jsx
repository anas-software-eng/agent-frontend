import { useEffect, useMemo, useState } from 'react'

import './Dashboard.css'
import InvoiceWorkspace from './InvoiceWorkspace'



const navigation = [
  { section: 'Workspace', items: [{ id: 'overview', label: 'Overview', icon: 'grid' }, { id: 'products', label: 'Products', icon: 'box', count: '24' }, { id: 'invoices', label: 'Invoices', icon: 'file', count: '8' }] },
  { section: 'Manage', items: [{ id: 'customers', label: 'Customers', icon: 'users' }, { id: 'reports', label: 'Reports', icon: 'chart' }] },
]

const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" /></>,
  file: <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M13 2v7h7M8 14h8M8 18h8" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
  dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
}

const Icon = ({ name, size = 20 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {iconPaths[name]}
  </svg>
)

const formatMoney = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(value)



function Dashboard() {
  const [activePage, setActivePage] = useState('overview')


  const [query, setQuery] = useState('')

  const [modal, setModal] = useState('')

  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])



  const pageTitle = navigation.flatMap((group) => group.items).find((item) => item.id === activePage)?.label || 'Overview'

  const openModal = (type) => {
    setModal(type)
    if (type === 'product') setActivePage('products')
    if (type === 'invoice') setActivePage('invoices')
  }





  const handleLogout = () => window.location.assign('/login')











  return (
    <main className="workspace-shell">
      <aside className="workspace-sidebar">
        <a className="workspace-brand" href="/" aria-label="A.T.O.M home"><span className="brand-initial">A</span><span>A.T.O.M<span className="brand-period">_</span></span></a>

        <nav className="sidebar-navigation" aria-label="Main navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.section}>
              <span className="nav-section-title">{group.section}</span>
              {group.items.map((item) => (
                <button className={activePage === item.id ? 'sidebar-link selected' : 'sidebar-link'} key={item.id} onClick={() => { setActivePage(item.id); setQuery('') }} type="button">
                  <Icon name={item.icon} size={19} /><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-link" type="button" onClick={() => setToast('Settings will be connected to your workspace later.')}><Icon name="settings" size={19} /><span>Settings</span></button>

          <button className="profile-button" type="button" onClick={handleLogout} title="Sign out">

            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <label className="workspace-search"><Icon name="search" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={activePage === 'products' ? 'Search products…' : activePage === 'invoices' ? 'Search invoices…' : 'Search'} aria-label={`Search ${activePage}`} /></label>
            <button className="notification-button" type="button" aria-label="Notifications" onClick={() => setToast('You’re all caught up!')}><Icon name="bell" size={19} /><i /></button>
            <span className="topbar-divider" />

          </div>
        </header>

        <div className="workspace-content">
          <div className="page-intro">

            {activePage === 'overview' && <div className="intro-actions"><button className="secondary-action" type="button" onClick={() => setToast('Your report is ready to connect to live data.')}><Icon name="download" size={16} /> Download report</button><button className="primary-action" type="button" onClick={() => setActivePage('invoices')}><Icon name="plus" size={17} /> Create invoice</button></div>}
            {activePage === 'products' && <button className="primary-action intro-single-action" type="button" onClick={() => openModal('product')}><Icon name="plus" size={17} /> Add product</button>}
          </div>

          {activePage === 'invoices' && <InvoiceWorkspace />}
          {(activePage === 'customers' || activePage === 'reports') && <section className="surface-card placeholder-card"><span className="placeholder-icon"><Icon name={activePage === 'customers' ? 'users' : 'chart'} size={25} /></span><h2>{pageTitle} are coming soon</h2><p>This area is part of the demo workspace and can be connected when you add real data.</p><button className="primary-action" type="button" onClick={() => setActivePage('overview')}>Back to overview</button></section>}
          <footer className="workspace-footer"><span>© 2026 A.T.O.M. Dashboard</span><span><i className="demo-dot" /> howdy Anas</span></footer>
        </div>
      </div>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setModal('') }}>
          <section className="workspace-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading"><div><span className="invoice-kicker">Demo workspace</span><h2 id="modal-title">{modal === 'invoice' ? 'Create invoice' : 'Add a product'}</h2></div><button type="button" className="modal-close" aria-label="Close dialog" onClick={() => setModal('')}>×</button></div>
            <p className="modal-help">This creates a local sample record only. Connect your API when you’re ready.</p>
            <form className="modal-form" onSubmit={handleModalSubmit}>
              {modal === 'invoice' ? (
                <>
                  <label>Customer name<input autoFocus name="customer" required placeholder="e.g. Alex Morgan" /></label>
                  <label>Customer email<input name="email" type="email" placeholder="alex@company.com" /></label>
                  <div className="modal-fields-row"><label>Amount (USD)<input min="0.01" name="amount" required step="0.01" type="number" placeholder="0.00" /></label><label>Due date<input name="due" type="date" /></label></div>
                </>
              ) : (
                <>
                  <label>Product name<input autoFocus name="name" required placeholder="e.g. Wireless Keyboard" /></label>
                  <div className="modal-fields-row"><label>SKU<input name="sku" placeholder="SKU-001" /></label><label>Category<select name="category"><option>Electronics</option><option>Accessories</option><option>Home &amp; Living</option><option>Subscriptions</option></select></label></div>
                  <div className="modal-fields-row"><label>Price (USD)<input min="0" name="price" required step="0.01" type="number" placeholder="0.00" /></label><label>Stock quantity<input min="0" name="stock" required type="number" placeholder="0" /></label></div>
                </>
              )}
              <div className="modal-footer"><button className="secondary-action" type="button" disabled={saving} onClick={() => setModal('')}>Cancel</button><button className="primary-action" type="submit" disabled={saving}>{saving ? 'Saving…' : modal === 'invoice' ? 'Create draft' : 'Add product'}</button></div>
            </form>
          </section>
        </div>
      )}
      {toast && <div className="workspace-toast" role="status">{toast}</div>}
    </main>
  )
}

export default Dashboard
