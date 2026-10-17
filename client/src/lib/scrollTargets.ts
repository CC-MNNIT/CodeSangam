// Named scroll destinations. Pinned scroll stages register where a section
// "starts" in document coordinates so the nav can jump to it from any page.
const targets = new Map<string, () => number>();

export function registerScrollTarget(id: string, getY: () => number) {
  targets.set(id, getY);
  return () => {
    if (targets.get(id) === getY) targets.delete(id);
  };
}

export function scrollToTarget(id: string, smooth = true): boolean {
  const getY = targets.get(id);
  if (!getY) return false;
  window.scrollTo({ top: getY(), behavior: smooth ? "smooth" : "auto" });
  return true;
}
