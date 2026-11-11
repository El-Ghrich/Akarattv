import type { Block } from 'payload'
import { l } from '@/utilities/labels'

const YOUTUBE_URL =
  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)[\w-]{11}(?:[?&#].*)?$/i

export const YouTubeBlock: Block = {
  slug: 'youtube',
  labels: {
    singular: l('YouTube video', 'Vidéo YouTube', 'فيديو يوتيوب'),
    plural: l('YouTube videos', 'Vidéos YouTube', 'فيديوهات يوتيوب'),
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: l('YouTube URL', 'URL YouTube', 'رابط يوتيوب'),
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) {
          return 'Enter a YouTube URL.'
        }

        return YOUTUBE_URL.test(value.trim())
          ? true
          : 'Enter a valid YouTube URL (youtube.com/watch?v=…, youtu.be/…, /shorts/…).'
      },
      admin: {
        description: l(
          'Rendered lazily on the frontend, so it does not slow down the page load.',
          'Chargée en différé sur le site, pour ne pas ralentir le chargement de la page.',
          'يُحمَّل بشكل مؤجل في الواجهة حتى لا يُبطئ تحميل الصفحة.',
        ),
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: l('Video title', 'Titre de la vidéo', 'عنوان الفيديو'),
      admin: {
        description: l(
          'Used as the embed title for screen readers.',
          'Utilisé comme titre de l’intégration pour les lecteurs d’écran.',
          'يُستخدم كعنوان للتضمين لقارئات الشاشة.',
        ),
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: l('Caption', 'Légende', 'التسمية التوضيحية'),
    },
  ],
}
