let startedAt = 0

export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    startedAt ||= Date.now()
    const uptimeSeconds = Math.round((Date.now() - startedAt) / 1000)

    return Response.json({
      startedAt,
      startedAtIso: new Date(startedAt).toISOString(),
      uptimeSeconds,
      nowIso: new Date().toISOString(),
      request: {
        method: request.method,
        url: extractUrl(request.url),
        headers: Object.fromEntries(request.headers),
        cf: request.cf
      }
    })
  }
}

function extractUrl(url) {
  const { href, origin, protocol, username, password, hostname, host, port, pathname,
          search, searchParams } = new URL(url)
  return {
    href, origin, protocol, username, password, hostname, host, port, pathname,
    search, searchParams: Object.fromEntries(searchParams)
  }
}
