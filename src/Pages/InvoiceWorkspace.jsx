import { useEffect, useMemo, useState } from 'react'
import { invoiceApi } from '../api'

const today = () => {
  const date = new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
const emptyItem = () => ({ name: '', quantity: '1', unitPrice: '', taxRate: '0' })
const emptyInvoice = () => ({
  customerName: '',
  customerEmail: '',
  billingAddress: '',
  shippingAddress: '',
  issueDate: today(),
  dueDate: '',
  currency: 'USD',
  discount: '0',
  discountType: 'fixed',
  adjustment: '0',
  notes: '',
  terms: '',
  items: [emptyItem()],
})

const money = (amount, currency = 'USD') => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency,
}).format(amount || 0)

const InvoiceWorkspace = () => {
  const [form, setForm] = useState(emptyInvoice)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [downloadingId, setDownloadingId] = useState('')
  const [notice, setNotice] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const totals = useMemo(() => {
    const subtotal = form.items.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
      0,
    )
    const tax = form.items.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0) * Number(item.taxRate || 0) / 100,
      0,
    )
    const discount = form.discountType === 'percent'
      ? subtotal * Number(form.discount || 0) / 100
      : Number(form.discount || 0)
    return { subtotal, tax, total: Math.max(0, subtotal + tax - discount + Number(form.adjustment || 0)) }
  }, [form])

  useEffect(() => {
    let active = true
    invoiceApi.list()
      .then(({ data }) => {
        if (active) setInvoices(data)
      })
      .catch((error) => {
        if (active) setErrorMessage(error.response?.data?.message || 'Unable to load invoices.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const setItem = (index, field, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setNotice('')
    setErrorMessage('')
    try {
      const { data } = await invoiceApi.create({
        ...form,
        discount: Number(form.discount || 0),
        adjustment: Number(form.adjustment || 0),
        items: form.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          taxRate: Number(item.taxRate),
        })),
      })
      setInvoices((current) => [data, ...current])
      setNotice(`Invoice ${data.invoiceNumber} created successfully.`)
      setForm(emptyInvoice())
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to create invoice. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const downloadPdf = async (invoice) => {
    setDownloadingId(invoice._id)
    setErrorMessage('')
    try {
      const { data } = await invoiceApi.downloadPdf(invoice._id)
      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = `${invoice.invoiceNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setErrorMessage('Unable to download this invoice PDF. Please try again.')
    } finally {
      setDownloadingId('')
    }
  }

  return (
    <div className="invoice-workspace">
      <section className="invoice-panel" aria-labelledby="create-invoice-title">
        <div className="invoice-panel-heading">
          <div>
            <span className="invoice-kicker">Billing</span>
            <h2 id="create-invoice-title">Create an invoice</h2>
          </div>
          <span className="invoice-preview-total">{money(totals.total, form.currency)}</span>
        </div>

        {notice && <p className="invoice-notice" role="status">{notice}</p>}
        {errorMessage && <p className="auth-notice" role="alert">{errorMessage}</p>}

        <form className="invoice-form" onSubmit={handleSubmit}>
          <div className="invoice-form-grid">
            <label>
              Customer name <span aria-hidden="true">*</span>
              <input required value={form.customerName} onChange={(event) => setField('customerName', event.target.value)} />
            </label>
            <label>
              Customer email
              <input type="email" value={form.customerEmail} onChange={(event) => setField('customerEmail', event.target.value)} />
            </label>
            <label>
              Invoice date <span aria-hidden="true">*</span>
              <input required type="date" value={form.issueDate} onChange={(event) => setField('issueDate', event.target.value)} />
            </label>
            <label>
              Due date
              <input type="date" min={form.issueDate} value={form.dueDate} onChange={(event) => setField('dueDate', event.target.value)} />
            </label>
            <label className="invoice-address">
              Bill to
              <textarea rows="2" value={form.billingAddress} onChange={(event) => setField('billingAddress', event.target.value)} />
            </label>
            <label className="invoice-address">
              Ship to
              <textarea rows="2" value={form.shippingAddress} onChange={(event) => setField('shippingAddress', event.target.value)} />
            </label>
          </div>

          <div className="invoice-items-heading">
            <h3>Items</h3>
            <button type="button" className="invoice-text-button" onClick={() => setField('items', [...form.items, emptyItem()])}>
              + Add item
            </button>
          </div>
          <div className="invoice-items">
            <div className="invoice-item-labels" aria-hidden="true">
              <span>Item name</span><span>Qty</span><span>Unit price</span><span>Tax %</span><span>Amount</span><span />
            </div>
            {form.items.map((item, index) => (
              <div className="invoice-item-row" key={index}>
                <input aria-label={`Item ${index + 1} name`} required placeholder="Description" value={item.name} onChange={(event) => setItem(index, 'name', event.target.value)} />
                <input aria-label={`Item ${index + 1} quantity`} placeholder="Qty" required min="0.000001" step="any" type="number" value={item.quantity} onChange={(event) => setItem(index, 'quantity', event.target.value)} />
                <input aria-label={`Item ${index + 1} unit price`} placeholder="Price" required min="0" step="0.01" type="number" value={item.unitPrice} onChange={(event) => setItem(index, 'unitPrice', event.target.value)} />
                <input aria-label={`Item ${index + 1} tax percentage`} placeholder="Tax %" min="0" max="100" step="0.01" type="number" value={item.taxRate} onChange={(event) => setItem(index, 'taxRate', event.target.value)} />
                <strong>{money(Number(item.quantity || 0) * Number(item.unitPrice || 0) * (1 + Number(item.taxRate || 0) / 100), form.currency)}</strong>
                <button
                  type="button"
                  className="invoice-remove-button"
                  aria-label={`Remove item ${index + 1}`}
                  disabled={form.items.length === 1}
                  onClick={() => setField('items', form.items.filter((_, itemIndex) => itemIndex !== index))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="invoice-bottom-grid">
            <div className="invoice-form-grid">
              <label>
                Currency
                <select value={form.currency} onChange={(event) => setField('currency', event.target.value)}>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — Pound Sterling</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="AUD">AUD — Australian Dollar</option>
                </select>
              </label>
              <label>
                Discount
                <div className="invoice-input-combo">
                  <input min="0" step="0.01" type="number" value={form.discount} onChange={(event) => setField('discount', event.target.value)} />
                  <select aria-label="Discount type" value={form.discountType} onChange={(event) => setField('discountType', event.target.value)}>
                    <option value="fixed">{form.currency}</option>
                    <option value="percent">%</option>
                  </select>
                </div>
              </label>
              <label>
                Adjustment
                <input step="0.01" type="number" value={form.adjustment} onChange={(event) => setField('adjustment', event.target.value)} />
              </label>
              <label>
                Notes
                <textarea rows="2" value={form.notes} onChange={(event) => setField('notes', event.target.value)} />
              </label>
              <label className="invoice-address">
                Terms &amp; conditions
                <textarea rows="2" value={form.terms} onChange={(event) => setField('terms', event.target.value)} />
              </label>
            </div>
            <div className="invoice-totals" aria-live="polite">
              <div><span>Subtotal</span><strong>{money(totals.subtotal, form.currency)}</strong></div>
              <div><span>Tax</span><strong>{money(totals.tax, form.currency)}</strong></div>
              <div className="invoice-grand-total"><span>Total</span><strong>{money(totals.total, form.currency)}</strong></div>
            </div>
          </div>
          <button className="invoice-submit" type="submit" disabled={saving}>
            {saving ? 'Creating invoice…' : 'Create invoice'}
          </button>
        </form>
      </section>

      <section className="invoice-panel" aria-labelledby="invoices-title">
        <div className="invoice-panel-heading">
          <div>
            <span className="invoice-kicker">Your records</span>
            <h2 id="invoices-title">Recent invoices</h2>
          </div>
          <span className="invoice-count">{invoices.length} total</span>
        </div>
        {loading ? (
          <p className="invoice-empty">Loading invoices…</p>
        ) : invoices.length === 0 ? (
          <p className="invoice-empty">Your created invoices will appear here.</p>
        ) : (
          <div className="invoice-list">
            {invoices.map((invoice) => (
              <article className="invoice-list-row" key={invoice._id}>
                <div>
                  <strong>{invoice.invoiceNumber}</strong>
                  <span>{invoice.customerName} · {new Date(invoice.issueDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}</span>
                </div>
                <strong>{money(invoice.total, invoice.currency)}</strong>
                <button type="button" className="invoice-download-button" disabled={downloadingId === invoice._id} onClick={() => downloadPdf(invoice)}>
                  {downloadingId === invoice._id ? 'Preparing…' : 'Download PDF'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default InvoiceWorkspace
