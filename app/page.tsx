import Link from "next/link";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <section className="px-4 py-10 max-w-6xl mx-auto space-y-16">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
          About NIT Delhi
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
          The National Institute of Technology Delhi (NIT Delhi) is an
          autonomous institute established in 2010 under the Ministry of
          Education, Government of India. The institute offers cutting-edge
          education and research opportunities across Engineering, Science,
          Management, and Humanities.
          <br />
          <br />
          Initially started at NIT Warangal, NIT Delhi transitioned through a
          temporary campus in Narela and now operates from a fully developed
          permanent campus equipped with state-of-the-art infrastructure and
          labs.
          <br />
          <br />
          NIT Delhi is dedicated to excellence in education, fostering
          professional ethics, innovation, and holistic development. It has
          gained significant recognition nationally and internationally for its
          impactful contributions and high-quality graduates.
        </p>
      </div>
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
          Batch 2026 Demographics
        </h2>
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Bachelor of Technology (B.Tech)
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border border-gray-200 dark:border-gray-700 text-left text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">
                    Branch
                  </th>
                  <th className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">
                    No. of Students
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  ["Computer Science", 124],
                  ["Electronics & Communication", 70],
                  ["Electrical", 65],
                  ["Mechanical", 46],
                  ["Civil", 28],
                ].map(([branch, count], idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {branch}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {count}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50 dark:bg-gray-900">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    Total
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    333
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Master of Technology (M.Tech)
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border border-gray-200 dark:border-gray-700 text-left text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">
                    Branch
                  </th>
                  <th className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">
                    No. of Students
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  ["Computer Science & Engineering", 22],
                  ["Computer Science & Engineering (Analytics)", 18],
                  ["Mathematics & Computing", 9],
                  ["Electronics & Communication", 13],
                  ["VLSI", 28],
                  ["Electrical - Power & Energy Systems", 7],
                  ["Electrical - Power Electronics & Drives", 9],
                  ["Civil", 13],
                  ["Mechanical - CAD/CAM", 10],
                ].map(([branch, count], idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {branch}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                      {count}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50 dark:bg-gray-900">
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    Total
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white">
                    129
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
