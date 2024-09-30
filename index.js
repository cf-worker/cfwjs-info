let startedAt = 0
let counter = 0

export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    startedAt ||= Date.now()
    counter++

    if (request.url.endsWith("favicon.ico")) {
      return emptyFaviconResponse()
    }

    const uptimeSeconds = Math.round((Date.now() - startedAt) / 1000)

    const headers = Object.fromEntries(request.headers)
    const cookies = headers["cookie"] ? parseCookie(headers["cookie"]) : null
    delete headers["cookie"]

    return Response.json({
      counter,
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

function emptyFaviconResponse() {
  return new Response(null, {
    status: 204,
    statusText: "No Content",
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=15552000"
    }
  })
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
