import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { revalidationTags } from '@/utilities/cacheTags'
import { l } from '@/utilities/labels'
import { revalidateContent } from '@/utilities/revalidate'
import { extractYouTubeId, fetchYouTubeMetadata, youtubeThumbnail } from '@/utilities/youtube'

/**
 * Videos from the Akarat TV YouTube channel, shown in the homepage carousel.
 *
 * Editors paste a YouTube URL and the metadata (title, thumbnail, duration,
 * views, publish date) is filled from YouTube on save. Duration and view count
 * require `YOUTUBE_API_KEY`; without it oEmbed still fills the title and
 * thumbnail and the two numeric fields stay manual.
 *
 * `showOnHomepage` and `order` are the only editorial controls: no drafts or
 * versions, because a video is either on the homepage or it is not.
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: l('Video', 'Vidéo', 'فيديو'),
    plural: l('Videos', 'Vidéos', 'الفيديوهات'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'showOnHomepage', 'order', 'publishedAt', 'updatedAt'],
    group: l('Content', 'Contenu', 'المحتوى'),
    description: l(
      'Paste a YouTube URL and save. Title, thumbnail, duration and views are filled automatically.',
      'Collez une URL YouTube puis enregistrez. Le titre, la miniature, la durée et les vues sont remplis automatiquement.',
      'الصق رابط يوتيوب ثم احفظ. يُملأ العنوان والصورة المصغّرة والمدة والمشاهدات تلقائياً.',
    ),
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    /**
     * Runs before validation so the required `youtubeUrl` is enough to create a
     * document: `title` and the other metadata are already populated by the
     * time validation looks at them.
     *
     * Refreshing is opt-in on updates unless the URL changed, so an editor can
     * correct a title without YouTube overwriting it on the next save.
     */
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        if (!data) return data

        const url = typeof data.youtubeUrl === 'string' ? data.youtubeUrl.trim() : ''
        if (!url) return data

        const videoId = extractYouTubeId(url)
        if (!videoId) return data

        data.videoId = videoId

        const previousId =
          typeof originalDoc?.videoId === 'string' ? originalDoc.videoId : undefined
        const shouldRefresh =
          data.refreshMetadata === true ||
          operation === 'create' ||
          !data.title ||
          previousId !== videoId

        // The checkbox is a one-shot trigger; do not persist it as "on".
        data.refreshMetadata = false

        if (!shouldRefresh) return data

        const metadata = await fetchYouTubeMetadata(videoId, req.payload.logger)

        if (!metadata) {
          // Keep the save usable when YouTube cannot be reached: fall back to
          // values that are still good enough for the card.
          if (!data.title) data.title = `YouTube ${videoId}`
          if (!data.thumbnailUrl) data.thumbnailUrl = youtubeThumbnail(videoId, 'hq')

          return data
        }

        data.title = metadata.title || data.title || `YouTube ${videoId}`
        data.thumbnailUrl = metadata.thumbnailUrl
        data.description = metadata.description ?? data.description
        data.authorName = metadata.authorName ?? data.authorName
        data.durationSeconds = metadata.durationSeconds ?? data.durationSeconds
        data.viewCount = metadata.viewCount ?? data.viewCount
        data.publishedAt = metadata.publishedAt ?? data.publishedAt

        return data
      },
    ],
    afterChange: [() => revalidateContent(revalidationTags.video)],
    afterDelete: [() => revalidateContent(revalidationTags.video)],
  },
  fields: [
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      label: l('YouTube URL', 'URL YouTube', 'رابط يوتيوب'),
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) {
          return 'Enter a YouTube URL.'
        }

        return extractYouTubeId(value)
          ? true
          : 'Enter a valid YouTube URL (youtube.com/watch?v=…, youtu.be/…, /shorts/…).'
      },
      admin: {
        description: l(
          'Watch, share, Shorts or youtu.be links are all accepted.',
          'Les liens watch, share, Shorts ou youtu.be sont acceptés.',
          'تُقبل روابط المشاهدة والمشاركة وShorts وyoutu.be.',
        ),
      },
    },
    {
      name: 'title',
      type: 'text',
      // Filled from YouTube before validation. Not `required` so the admin form
      // does not block a save before the hook has had a chance to run.
      label: l('Title', 'Titre', 'العنوان'),
      admin: {
        description: l(
          'Filled from YouTube. Edit to override.',
          'Rempli depuis YouTube. Modifiable.',
          'يُملأ من يوتيوب ويمكن تعديله.',
        ),
      },
    },
    {
      name: 'videoId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: l(
          'Extracted from the URL.',
          "Extrait de l'URL.",
          'مستخرج من الرابط.',
        ),
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: l('Description', 'Description', 'الوصف'),
      admin: {
        description: l(
          'Filled from YouTube (used by structured data).',
          'Rempli depuis YouTube (utilisé par les données structurées).',
          'يُملأ من يوتيوب (يُستخدم في البيانات المنظمة).',
        ),
      },
    },
    {
      name: 'authorName',
      type: 'text',
      label: l('Channel', 'Chaîne', 'القناة'),
      admin: {
        readOnly: true,
        description: l('Filled from YouTube.', 'Rempli depuis YouTube.', 'يُملأ من يوتيوب.'),
      },
    },
    {
      name: 'thumbnailUrl',
      type: 'text',
      label: l('Thumbnail URL', 'URL de la miniature', 'رابط الصورة المصغّرة'),
      admin: {
        readOnly: true,
        description: l(
          'Filled from YouTube. The frontend loads it from i.ytimg.com.',
          'Rempli depuis YouTube. Le site la charge depuis i.ytimg.com.',
          'يُملأ من يوتيوب ويُحمَّل من i.ytimg.com.',
        ),
      },
    },
    {
      name: 'durationSeconds',
      type: 'number',
      label: l('Duration (seconds)', 'Durée (secondes)', 'المدة (ثانية)'),
      min: 0,
      admin: {
        description: l(
          'Filled from YouTube when the Data API key is configured.',
          "Rempli depuis YouTube quand la clé de l'API Data est configurée.",
          'يُملأ من يوتيوب عند إعداد مفتاح Data API.',
        ),
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      label: l('Views', 'Vues', 'المشاهدات'),
      min: 0,
      admin: {
        description: l(
          'Snapshot from the last refresh.',
          'Instantané de la dernière actualisation.',
          'لقطة من آخر تحديث.',
        ),
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: l('Published at', 'Date de publication', 'تاريخ النشر'),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: true,
      label: l('Show on homepage', "Afficher sur l'accueil", 'إظهار في الصفحة الرئيسية'),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: l('Order', 'Ordre', 'الترتيب'),
      admin: {
        position: 'sidebar',
        description: l(
          'Lower numbers appear first.',
          'Les nombres les plus petits apparaissent en premier.',
          'الأرقام الأصغر تظهر أولاً.',
        ),
      },
    },
    {
      name: 'refreshMetadata',
      type: 'checkbox',
      defaultValue: false,
      label: l('Refresh metadata', 'Actualiser les métadonnées', 'تحديث البيانات الوصفية'),
      admin: {
        position: 'sidebar',
        description: l(
          'Re-fetch the title, thumbnail, duration, views and date from YouTube on save.',
          'Récupère à nouveau le titre, la miniature, la durée, les vues et la date depuis YouTube.',
          'يعيد جلب العنوان والصورة المصغّرة والمدة والمشاهدات والتاريخ من يوتيوب.',
        ),
      },
    },
  ],
}
