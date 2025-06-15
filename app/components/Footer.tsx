export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 py-6 mb-0">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p>
          © {new Date().getFullYear()} Training and Placement Cell, NIT Delhi
        </p>
        <p className="mt-2 sm:mt-0">
          Designed by : <span className="font-medium text-gray-800 dark:text-gray-200">T&P Database Team</span>
        </p>
      </div>
    </footer>
  );
}