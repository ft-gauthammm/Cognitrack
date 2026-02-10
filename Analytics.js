function Analytics({ dualStressData }) {
  return (
    <div className="space-y-6">

      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-white">
          Stress Analytics
        </h2>
        <p className="text-sm text-gray-400">
          Comparative analysis of blink stress and visual load over time
        </p>
      </div>

      {/* Dual Stress Graph */}
      <DualStressChart data={dualStressData} />

      {/* Future analytics blocks */}
      <div className="glass-panel p-6 rounded-xl opacity-50">
        <p className="text-sm text-gray-400">
          More analytics coming soon…
        </p>
      </div>

    </div>
  );
}
