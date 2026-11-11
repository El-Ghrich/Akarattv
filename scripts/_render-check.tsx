import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { RichText } from '../src/components/RichText'

const content = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'rtl',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'rtl',
        children: [
          {
            type: 'text',
            text: 'قال 2026 إن Paris جميلة.',
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
      {
        type: 'quote',
        format: '',
        indent: 0,
        version: 1,
        direction: 'rtl',
        children: [
          {
            type: 'text',
            text: 'اقتباس',
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
      {
        type: 'block',
        format: '',
        version: 2,
        fields: {
          blockType: 'imageBlock',
          blockName: '',
          alt: 'صورة تجريبية',
          caption: 'تسمية الصورة',
          image: { url: '/api/media/file/a.jpg', alt: 'fallback', width: 1200, height: 800 },
        },
      },
      {
        type: 'block',
        format: '',
        version: 2,
        fields: {
          blockType: 'pullQuote',
          quote: 'الجودة قبل الكمية',
          attribution: 'أكرم',
        },
      },
      {
        type: 'block',
        format: '',
        version: 2,
        fields: {
          blockType: 'relatedArticle',
          article: { id: 3, slug: 'sakan', title: 'السكن', excerpt: 'مقتطف' },
        },
      },
      {
        type: 'block',
        format: '',
        version: 2,
        fields: {
          blockType: 'youtube',
          url: 'https://youtu.be/dQw4w9WgXcQ',
          title: 'فيديو',
          caption: 'تسمية الفيديو',
        },
      },
      {
        type: 'block',
        format: '',
        version: 2,
        fields: {
          blockType: 'infoBox',
          variant: 'warning',
          title: 'تنبيه',
          body: 'السطر الأول\n\nالسطر الثاني',
        },
      },
    ],
  },
}

const html = renderToStaticMarkup(
  React.createElement(RichText, { content, locale: 'ar' }),
)

for (const check of [
  '<p dir="rtl">',
  '<blockquote dir="rtl">',
  '<figure class="rich-text__figure" dir="auto">',
  '<figcaption>تسمية الصورة</figcaption>',
  '<blockquote dir="auto"><p>الجودة قبل الكمية</p></blockquote>',
  '<cite>أكرم</cite>',
  '<aside class="rich-text__related" dir="auto">',
  'youtube-nocookie.com/embed/dQw4w9WgXcQ',
  'class="rich-text__infobox rich-text__infobox--warning"',
]) {
  if (!html.includes(check)) {
    console.error('MISSING:', check)
    process.exitCode = 1
  }
}

console.log(html)
