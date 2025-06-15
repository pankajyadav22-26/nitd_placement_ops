"use client";

import { useEffect, useState } from "react";

type Stat = {
  count?: number;
  total?: number;
  sum: number;
  average?: number;
  avg?: number;
  median: number;
  min: number;
  max: number;
};

type FteStat = {
  totalStudents: number;
  eligibleStudents: number;
  fteStats: Stat;
  branchWiseStats: Record<string, Stat>;
};

type InternStat = {
  totalStudents: number;
  eligibleStudents: number;
  overall: Stat;
  branchWise: Record<string, Stat>;
};

export default function StatsPage() {
  const [btechFte, setBtechFte] = useState<FteStat | null>(null);
  const [btechIntern, setBtechIntern] = useState<InternStat | null>(null);
  const [mtechFte, setMtechFte] = useState<FteStat | null>(null);
  const [mtechIntern, setMtechIntern] = useState<InternStat | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [bF, bI, mF, mI] = await Promise.all([
          fetch("/api/statistics/btech/fte").then((res) => res.json()),
          fetch("/api/statistics/btech/intern").then((res) => res.json()),
          fetch("/api/statistics/mtech/fte").then((res) => res.json()),
          fetch("/api/statistics/mtech/intern").then((res) => res.json()),
        ]);

        setBtechFte(bF);
        setBtechIntern(bI);
        setMtechFte(mF);
        setMtechIntern(mI);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  const formatStat = (stat: Stat) => (
    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
      {stat.count !== undefined && (
        <p>
          <span className="font-medium">Count:</span> {stat.count}
        </p>
      )}
      {stat.total !== undefined && (
        <p>
          <span className="font-medium">Total:</span> {stat.total}
        </p>
      )}
      <p>
        <span className="font-medium">Sum:</span> {stat.sum}
      </p>
      <p>
        <span className="font-medium">Average:</span> {stat.average ?? stat.avg}
      </p>
      <p>
        <span className="font-medium">Median:</span> {stat.median}
      </p>
      <p>
        <span className="font-medium">Min:</span> {stat.min || 0}
      </p>
      <p>
        <span className="font-medium">Max:</span> {stat.max || 0}
      </p>
    </div>
  );

  const StatBlock = ({
    title,
    total,
    eligible,
    mainStat,
    branchWise,
    extraStatLabel,
    extraStat,
  }: {
    title: string;
    total: number;
    eligible: number;
    mainStat: Stat;
    branchWise: Record<string, Stat>;
    extraStatLabel?: string;
    extraStat?: number;
  }) => (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm transition-colors">
      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
        {title}
      </h3>

      <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300 mb-4">
        <p>
          <span className="font-medium">Total Students:</span> {total}
        </p>
        <p>
          <span className="font-medium">Eligible Students:</span> {eligible}
        </p>
        {extraStatLabel && (
          <p>
            <span className="font-medium">{extraStatLabel}:</span> {extraStat}
          </p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Overall
        </h4>
        {formatStat(mainStat)}
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Branch-wise
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(branchWise).map(([branch, stat]) => (
            <div
              key={branch}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4"
            >
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-2">
                {branch}
              </p>
              {formatStat(stat)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400">
        Placement Statistics - Batch 2026
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {btechFte && (
          <StatBlock
            title="Bachelor of Technology - Full Type Employment (FTE)"
            total={btechFte.totalStudents}
            eligible={btechFte.eligibleStudents}
            mainStat={btechFte.fteStats}
            branchWise={btechFte.branchWiseStats}
          />
        )}
        {btechIntern && (
          <StatBlock
            title="Bachelor of Technology - Internship"
            total={btechIntern.totalStudents}
            eligible={btechIntern.eligibleStudents}
            mainStat={btechIntern.overall}
            branchWise={btechIntern.branchWise}
          />
        )}
        {mtechFte && (
          <StatBlock
            title="Master of Technology - Full Type Employment (FTE)"
            total={mtechFte.totalStudents}
            eligible={mtechFte.eligibleStudents}
            mainStat={mtechFte.fteStats}
            branchWise={mtechFte.branchWiseStats}
          />
        )}
        {mtechIntern && (
          <StatBlock
            title="Master of Technology - Internship"
            total={mtechIntern.totalStudents}
            eligible={mtechIntern.eligibleStudents}
            mainStat={mtechIntern.overall}
            branchWise={mtechIntern.branchWise}
          />
        )}
      </div>
    </div>
  );
}
