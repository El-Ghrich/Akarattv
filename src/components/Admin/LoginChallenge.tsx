'use client'

import { useTranslation } from '@payloadcms/ui'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'

import { ANSWER_COOKIE } from '@/utilities/loginCookies'

type ChallengeResponse = {
  question: string
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '6px',
} as const

const rowStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: '10px',
} as const

const inputStyle = {
  background: 'var(--theme-elevation-0)',
  border: '1px solid var(--theme-border-color)',
  borderRadius: '3px',
  color: 'var(--theme-text)',
  font: 'inherit',
  padding: '8px 10px',
  textAlign: 'center',
  width: '64px',
} as const

const buttonStyle = {
  background: 'transparent',
  border: 0,
  color: 'var(--theme-text)',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: '12px',
  textDecoration: 'underline',
} as const

/** Simple addition check shown above Payload's built-in login form. */
export function LoginChallenge() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [failed, setFailed] = useState(false)

  const refresh = useCallback(async () => {
    setFailed(false)

    try {
      const response = await fetch('/api/users/login-challenge', { cache: 'no-store' })

      if (!response.ok) throw new Error('Challenge request failed')

      const data = (await response.json()) as ChallengeResponse

      setQuestion(data.question)
      setAnswer('')
      document.cookie = `${ANSWER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
    } catch {
      setQuestion('')
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 3)

    setAnswer(value)
    document.cookie = `${ANSWER_COOKIE}=${value}; Path=/; Max-Age=300; SameSite=Lax`
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="login-challenge-answer" style={labelStyle}>
        {isArabic ? 'تحقق مضاد للروبوتات' : 'Vérification anti-robot'}
      </label>
      <div style={rowStyle}>
        <span style={{ fontSize: '15px', fontWeight: 600 }}>{question || '…'}</span>
        <input
          aria-label={isArabic ? 'ناتج الجمع' : 'Résultat de l’addition'}
          autoComplete="off"
          id="login-challenge-answer"
          inputMode="numeric"
          onChange={handleChange}
          style={inputStyle}
          type="text"
          value={answer}
        />
        <button onClick={() => void refresh()} style={buttonStyle} type="button">
          {isArabic ? 'سؤال آخر' : 'Autre question'}
        </button>
      </div>
      {failed ? (
        <p style={{ color: 'var(--theme-error-500)', fontSize: '12px', margin: '6px 0 0' }}>
          {isArabic
            ? 'تعذّر تحميل سؤال التحقق. حدّث الصفحة.'
            : 'Impossible de charger la vérification. Rechargez la page.'}
        </p>
      ) : null}
    </div>
  )
}
