// `ng serve` proxies /api and /Identity to the Storefront backend (see proxy.conf.json),
// so the portal talks to the API on its own origin, the same as in production.
export const environment = {
    apiUrl: "/api"
};
