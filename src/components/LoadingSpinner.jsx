export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando datos...</p>
        <p className="text-sm text-gray-400">Por favor espera un momento</p>
      </div>
    </div>
  );
}
