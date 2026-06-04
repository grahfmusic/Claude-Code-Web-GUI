// Server API client - reads projects/sessions over HTTP from the bundled
// Bun server (server/server.js). Works in Firefox and other browsers that
// lack the File System Access API, since it only uses fetch().

// Same-origin by default: the GUI is served by the server on :3000, so the
// API lives at the same origin. Override only if you serve GUI and API apart.
const API_BASE = ''

export async function isServerAvailable() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { cache: 'no-store' })
    return res.ok
  } catch {
    return false
  }
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/api/projects`)
  if (!res.ok) throw new Error(`Server returned ${res.status}`)
  const { projects } = await res.json()
  // [{ name, displayName, sessionCount, sessions: [{ id, summary, timestamp }...] }]
  return projects
}

export async function fetchSession(projectName, sessionId) {
  const res = await fetch(
    `${API_BASE}/api/sessions/${encodeURIComponent(projectName)}/${encodeURIComponent(sessionId)}`
  )
  if (!res.ok) throw new Error(`Server returned ${res.status}`)
  // { id, projectName, summary, timestamp, messages }
  return res.json()
}
