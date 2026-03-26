import { getBlogPosts } from '@/lib/sheets'

export async function GET() {
  try {
    const rows = await getBlogPosts()
    const posts = rows.map(r => ({
      tag:      r.tag,
      category: r.category,
      title:    r.title,
      excerpt:  r.excerpt,
      date:     r.date,
      readTime: r.read_time,
    }))
    return Response.json(posts)
  } catch {
    return Response.json([])
  }
}
