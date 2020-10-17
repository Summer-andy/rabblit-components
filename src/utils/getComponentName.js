export default function getComponentName(
  target
) {
  return (
    (process.env.NODE_ENV !== 'production' ? typeof target === 'string' && target : false) ||
    target.displayName ||
    target.name ||
    'Component'
  );
}
