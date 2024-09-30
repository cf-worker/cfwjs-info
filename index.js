let startedAt = 0
let counter = 0
let lastRequestTime = 0

export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    startedAt ||= lastRequestTime = Date.now()

    if (request.url.endsWith("favicon.ico")) {
      return emptyFaviconResponse()
    }

    const secondsElapsed = Math.round((Date.now() - lastRequestTime) / 1000)
    lastRequestTime = Date.now()
    counter++
    const uptimeSeconds = Math.round((Date.now() - startedAt) / 1000)
    const headers = Object.fromEntries(request.headers)
    const cookies = headers["cookie"] ? parseCookie(headers["cookie"]) : null
    delete headers["cookie"]
    let body = await request.text()
    if (body.length) {
      try {
        body = JSON.parse(body)
      } catch {
        body = Object.fromEntries(new URLSearchParams(body))
      }
    }

    return Response.json({
      counter,
      startedAt,
      startedAtIso: new Date(startedAt).toISOString(),
      uptimeSeconds,
      secondsElapsed,
      nowIso: new Date().toISOString(),
      method: request.method,
      url: extractUrl(request.url),
      headers,
      cookies,
      body,
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
