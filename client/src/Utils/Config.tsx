// Deployment base path.
//
// Set REACT_APP_BASE_URL to the path the app is served under, without a
// leading slash: empty for domain-root hosting (the live setup), "codesangam"
// when hosted in a subdirectory. Leading/trailing slashes are stripped so that
// "/codesangam/" and "codesangam" behave identically.
const BASE_URL = (process.env.REACT_APP_BASE_URL || "").replace(/^\/+|\/+$/g, "");

export default BASE_URL;

/**
 * Joins the deployment base path with a client route.
 *
 *   route()        -> "/"            "/codesangam"
 *   route("team")  -> "/team"        "/codesangam/team"
 *
 * Always use this instead of writing `/${BASE_URL}/...` by hand: with an empty
 * BASE_URL that template collapses to "//team", which browsers read as a
 * protocol-relative URL and send to a host called "team".
 */
export function route(subPath = ""): string {
  const base = BASE_URL ? `/${BASE_URL}` : "";
  return subPath ? `${base}/${subPath.replace(/^\/+/, "")}` : base || "/";
}

/**
 * Leaderboards stay on "To Be Announced" until this is true. Flip it once
 * this year's results are published; nothing else needs to change.
 */
export const RESULTS_ANNOUNCED = false;
