export default function Spinner({ full = false }) {
  const ring = (
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" role="status" aria-label="Loading" />
  );
  return full ? <div className="flex min-h-screen items-center justify-center">{ring}</div> : <div className="flex justify-center py-10">{ring}</div>;
}
