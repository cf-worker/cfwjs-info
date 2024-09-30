let startedAt = 0

export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    startedAt ||= Date.now()
    const uptimeSeconds = Math.round((Date.now() - startedAt) / 1000)

    const headers = Object.fromEntries(request.headers)
    const cookies = headers["cookie"] ? parseCookie(headers["cookie"]) : null
    delete headers["cookie"]

    return Response.json({
      startedAt,
      startedAtIso: new Date(startedAt).toISOString(),
      uptimeSeconds,
      nowIso: new Date().toISOString(),
      method: request.method,
      url: extractUrl(request.url),
      headers,
      cookies,
      cf: request.cf
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

const parseCookie = str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
      return acc
    }, {})
