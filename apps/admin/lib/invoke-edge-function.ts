import 'server-only'

export async function invokeEdgeFunction(name: string, body: Record<string, unknown>) {
  const url = `${process.env.SUPABASE_URL}/functions/v1/${name}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Edge function ${name} failed (${res.status}): ${text}`)
  }
}
