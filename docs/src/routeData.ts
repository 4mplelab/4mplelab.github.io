import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware(({ url, locals }) => {
  locals.starlightRoute.hasSidebar = /^\/LisM\/build_guides(?:\/|$)/.test(url.pathname);
});
