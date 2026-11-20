import { useEffect, useRef, useState } from 'react'
import { agentApi } from '../api'
import './Chatbot.css'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const sendMessage = async (event) => {
    event.preventDefault()
    const text = message.trim()
    if (!text || isSending) return

    setMessages((current) => [...current, { role: 'user', content: text }])
    setMessage('')
    setErrorMessage('')
    setIsSending(true)

    try {
      const { data } = await agentApi.chat(text, conversationId || undefined)
      setConversationId(data.conversationId)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: data.reply || 'I could not generate a response. Please try again.',
          task: data.task,
        },
      ])
    } catch (error) {
      setMessages((current) => current.slice(0, -1))
      setMessage(text)
      setErrorMessage(
        error.response?.data?.message || 'The assistant could not respond. Please try again.',
      )
    } finally {
      setIsSending(false)
    }
  }

  const startNewConversation = () => {
    setConversationId('')
    setMessages([])
    setErrorMessage('')
    setMessage('')
    inputRef.current?.focus()
  }

  return (
    <div className="assistant-widget">
      {isOpen && (
        <section className="assistant-panel" aria-label="AI task assistant">
          <header className="assistant-header">
            <div className="assistant-heading">
              <span className="assistant-avatar" aria-hidden="true">AI</span>
              <div>
                <h2>Task assistant</h2>
                <p>Ask a question or create a task</p>
              </div>
            </div>
            <div className="assistant-header-actions">
              <button
                type="button"
                className="assistant-header-button"
                onClick={startNewConversation}
                aria-label="Start a new conversation"
                title="New conversation"
                disabled={isSending}
              >
                +
              </button>
              <button
                type="button"
                className="assistant-header-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
              >
                ×
              </button>
            </div>
          </header>

          <div className="assistant-messages" aria-live="polite" aria-relevant="additions">
            {messages.length === 0 && (
              <div className="assistant-welcome">
                <span className="assistant-welcome-icon" aria-hidden="true">✦</span>
                <h3>How can I help?</h3>
                <p>Ask me anything, or try “Create a task to follow up with a customer.”</p>
              </div>
            )}
            {messages.map((item, index) => (
              <div className={`assistant-message assistant-message-${item.role}`} key={`${index}-${item.role}`}>
                <p>{item.content}</p>
                {item.task && (
                  <span className="assistant-task-badge">
                    Task created{item.task.title ? `: ${item.task.title}` : ''}
                  </span>
                )}
              </div>
            ))}
            {isSending && (
              <div className="assistant-message assistant-message-assistant assistant-thinking" role="status">
                Assistant is thinking…
              </div>
            )}
            {errorMessage && <p className="assistant-error" role="alert">{errorMessage}</p>}
            <div ref={messagesEndRef} />
          </div>

          <form className="assistant-composer" onSubmit={sendMessage}>
            <label className="assistant-sr-only" htmlFor="assistant-message">Message the assistant</label>
            <textarea
              id="assistant-message"
              ref={inputRef}
              rows="1"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form.requestSubmit()
                }
              }}
              placeholder="Write a message…"
              maxLength={4000}
              disabled={isSending}
            />
            <button type="submit" disabled={!message.trim() || isSending} aria-label="Send message">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M4.5 12 20 4l-4.5 16-3.1-6.4L4.5 12Z" />
                <path d="m12.4 13.6 4.1-4.1" />
              </svg>
            </button>
          </form>
          <p className="assistant-disclaimer">AI responses can be inaccurate. Review tasks before relying on them.</p>
        </section>
      )}

      <button
        type="button"
        className="assistant-launcher"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? '×' : <><span aria-hidden="true">✦</span><span>Ask AI</span></>}
      </button>
    </div>
  )
}

export default Chatbot
