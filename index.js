export default {
  async fetch(request) {
    const url = new URL(request.url);
    const backendUrl = new URL(url.pathname + url.search, "https://south.ayanakojivps.shop");
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length");
    headers.delete("accept-encoding");
    try {
      const upstream = await fetch(backendUrl.toString(), {
        method: request.method,
        headers: headers,
        body: (request.method === "GET" || request.method === "HEAD") ? undefined : request.body,
        redirect: "manual",
      });
      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set("cache-control", "no-store, no-cache, must-revalidate");
      responseHeaders.set("x-accel-buffering", "no");
      return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
    } catch (err) {
      return new Response("Bridge Error: " + err.message, { status: 502 });
    }
  }
};
