'use client'

import React, { useEffect, useRef, useState } from 'react'

import { ChatIcon, CopyCheckIcon, LinkIcon, ShareIcon } from '@/components/icons'
import { articleContent } from '@/content/article'
import type { Locale } from '@/i18n/routing'

export type ArticleShareProps = {
  locale: Locale
  title: string
  url: string
  variant?: 'bottom' | 'top'
}

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  // Fallback for browsers that block the async clipboard API on insecure
  // origins. It is deprecated, but it is the only copy path left there.
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

/**
 * Share buttons used at the top and bottom of the article. The copy button is
 * the only piece that needs client state; the network links are plain anchors.
 */
export function ArticleShare({ locale, title, url, variant = 'top' }: ArticleShareProps) {
  const content = articleContent[locale].share
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const onCopy = async () => {
    try {
      await copyToClipboard(url)
      setCopied(true)

      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Nothing useful to show if the browser refuses clipboard access; the
      // link itself remains selectable in the address bar.
    }
  }

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const iconSize = variant === 'bottom' ? 'h-8 w-8' : 'h-10 w-10'
  const iconClass = variant === 'bottom' ? 'h-[17px] w-[17px]' : 'h-5 w-5'

  const links = [
    {
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <ChatIcon className={iconClass} />,
      label: content.whatsapp,
    },
    {
      glyph: 'f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: content.facebook,
    },
    {
      glyph: '𝕏',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: content.x,
    },
    {
      glyph: 'in',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: content.linkedin,
    },
  ]

  const buttons = (
    <>
      {links.map((link) => (
        <a
          aria-label={link.label}
          className={`flex ${iconSize} items-center justify-center rounded-full border border-line bg-surface font-headline text-sm font-bold text-ink-700 transition-colors hover:border-gold-500 hover:bg-green-100 hover:text-green-900`}
          href={link.href}
          key={link.label}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.icon ?? link.glyph}
        </a>
      ))}

      <button
        aria-label={copied ? content.copied : content.copy}
        className={`flex ${iconSize} items-center justify-center rounded-full border transition-colors ${
          copied
            ? 'border-gold-500 bg-gold-500 text-green-950'
            : 'border-line bg-surface text-ink-700 hover:border-gold-500 hover:bg-green-100 hover:text-green-900'
        }`}
        onClick={onCopy}
        title={copied ? content.copied : content.copy}
        type="button"
      >
        {copied ? (
          <CopyCheckIcon className={iconClass} />
        ) : (
          <LinkIcon className={iconClass} />
        )}
      </button>
    </>
  )

  if (variant === 'bottom') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-surface p-4">
        <span className="font-headline text-meta font-bold text-green-900">{content.bottom}</span>
        <div className="flex items-center gap-2">{buttons}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto mb-8 flex max-w-[800px] flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
      <span className="flex items-center gap-2 font-headline text-meta font-bold text-ink-700">
        <ShareIcon className="h-[18px] w-[18px] text-gold-500" />
        <span>{content.top}</span>
      </span>

      <div className="flex items-center gap-2.5">{buttons}</div>
    </div>
  )
}

export default ArticleShare
