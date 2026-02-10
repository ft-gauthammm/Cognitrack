function EyeWidget({ blinkRate, setBlinkRate }) {
    // Calculate eye "openness" based on blink rate simulation
    // Higher blink rate = more jittery/active
    
    let statusColor = "text-green-400";
    let statusText = "NORMAL";
    if (blinkRate < 11) {
        statusColor = "text-red-400";
        statusText = "CRITICAL (Staring)";
    } else if (blinkRate < 15) {
        statusColor = "text-yellow-400";
        statusText = "REDUCED";
    }

    return (
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group" data-name="eye-widget" data-file="components/EyeWidget.js">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="icon-eye text-9xl text-white"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <div className="icon-eye text-xl"></div>
                        </div>
                        <h2 className="text-lg font-bold text-white">Eye Metrics</h2>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded bg-black/40 border border-white/10 ${statusColor} transition-colors duration-300`}>
                        {statusText}
                    </div>
                </div>

                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-mono font-bold text-white transition-all duration-300">{blinkRate}</span>
                    <span className="text-sm text-gray-400 mb-1">BPM</span>
                </div>
                
                <p className="text-sm text-gray-400 mb-6">Average Blink Rate</p>

                <div className="mb-4">
                    <input
                        type="range"
                        min="5"
                        max="30"
                        value={blinkRate}
                        onChange={(e) => setBlinkRate(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--secondary-color)] hover:accent-purple-400 transition-colors"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                        <span>5 BPM</span>
                        <span>15 BPM</span>
                        <span>30 BPM</span>
                    </div>
                </div>
                
                {/* Visualizer Bar - Animation speed driven by blink rate */}
                <div className="h-16 flex items-end gap-1 justify-between mt-4 opacity-70">
                   {[...Array(10)].map((_, i) => {
                       // Inverse relationship: lower blink rate (staring) = slower animation
                       // We map 5-30 bpm to roughly 2s - 0.2s duration
                       const speed = 2.5 - ((blinkRate / 30) * 2); 
                       
                       return (
                           <div 
                               key={i} 
                               className={`w-full rounded-t-sm transition-all duration-500 animate-[bounce_1s_infinite] ${
                                   i < (blinkRate / 3) 
                                   ? 'bg-[var(--secondary-color)] shadow-[0_0_10px_var(--secondary-color)]' 
                                   : 'bg-gray-700/30'
                               }`}
                               style={{ 
                                   animationDuration: `${speed + (Math.random() * 0.5)}s`,
                                   height: `${Math.random() * 40 + 20}%` 
                               }}
                           ></div>
                       );
                   })}
                </div>
            </div>
        </div>
    );
}