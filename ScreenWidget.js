function ScreenWidget({ screenLoad, setScreenLoad, reason, setReason }) {
    // Determine active window bar width based on load
    const loadLevelPercent = {
        'LOW': '30%',
        'MEDIUM': '65%',
        'HIGH': '95%'
    };

    const loadColor = {
        'LOW': 'bg-green-500',
        'MEDIUM': 'bg-yellow-500',
        'HIGH': 'bg-red-500'
    };

    return (
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden" data-name="screen-widget" data-file="components/ScreenWidget.js">
             <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors duration-500
                ${screenLoad === 'HIGH' ? 'bg-red-500' : screenLoad === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}
             `}></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <div className="icon-monitor text-xl"></div>
                </div>
                <h2 className="text-lg font-bold text-white">Screen Context</h2>
            </div>

            <div className="space-y-6 relative z-10">
                <div>
                    <label className="text-sm text-gray-400 mb-2 block">Cognitive Load Level</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setScreenLoad(level)}
                                className={`
                                    py-2 px-3 rounded-lg text-sm font-bold border transition-all duration-300 transform active:scale-95
                                    ${screenLoad === level 
                                        ? level === 'HIGH' ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] scale-105' 
                                        : level === 'MEDIUM' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)] scale-105'
                                        : 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)] scale-105'
                                        : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'}
                                `}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-400 mb-2 block">Detected Content / Reason</label>
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="glass-input w-full rounded-lg px-4 py-3 pl-10 text-sm focus:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            placeholder="e.g. High text density..."
                        />
                        <div className="icon-search absolute left-3 top-3.5 text-gray-500 text-sm group-focus-within:text-[var(--secondary-color)] transition-colors"></div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400">Calculated CPU/Visual Load</span>
                        <span className="text-xs font-mono text-white">
                            {screenLoad === 'LOW' ? '12%' : screenLoad === 'MEDIUM' ? '48%' : '89%'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-700/30 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${loadColor[screenLoad]} transition-all duration-700 ease-out`}
                            style={{ width: loadLevelPercent[screenLoad] }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}