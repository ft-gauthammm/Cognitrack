function StressAnalysis({ onAnalyze, result, isAnalyzing }) {
    return (
        <div className="glass-panel rounded-2xl p-6 md:col-span-2 flex flex-col justify-between relative overflow-hidden min-h-[300px]" data-name="stress-analysis" data-file="components/StressAnalysis.js">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--secondary-color)] to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-2 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                        <div className="icon-activity text-xl"></div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Stress Analysis</h2>
                        <p className="text-xs text-gray-400">AI Fusion Core</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4">
                {!result && !isAnalyzing && (
                    <div className="text-center text-gray-500">
                        <div className="icon-brain-circuit text-6xl mb-4 opacity-20 mx-auto"></div>
                        <p>Ready to analyze cognitive signals.</p>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[var(--primary-color)] font-mono animate-pulse">PROCESSING NEURAL SIGNALS...</p>
                    </div>
                )}

                {result && !isAnalyzing && (
                    <div className="w-full animate-[fadeIn_0.5s_ease-out] flex flex-col items-center">
                        
                        {/* Primary Suggestion - Large Text */}
                        <div className="flex flex-col items-center text-center mb-6 px-4 space-y-3">

                            {/* Primary emphasis text (formerly small text) */}
                            <p className="text-xl md:text-2xl font-semibold text-[var(--secondary-color)] tracking-wide">
                                Stress Level
                            </p>

                            {/* Glowing suggestion text — kept, but smaller */}
                            <h3 className="text-lg md:text-xl font-bold text-white leading-snug
                                           drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
                                {result.suggestion}
                            </h3>

                            {/* Subtle divider */}
                            <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[var(--secondary-color)] to-transparent opacity-60"></div>

                        </div>


                        {/* Detailed Metrics Container */}
                        <div className="flex items-center gap-4 md:gap-6 w-full max-w-xl bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                            {/* Compact Gauge */}
                            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                                    <circle 
                                        cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                        className={`${
                                            result.stressLevel === 'HIGH' ? 'text-red-500' : 
                                            result.stressLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
                                        } transition-all duration-1000 ease-out`}
                                        strokeDasharray="176"
                                        strokeDashoffset={
                                            result.stressLevel === 'HIGH' ? '44' : 
                                            result.stressLevel === 'MEDIUM' ? '88' : '132'
                                        }
                                    />
                                </svg>
                                <div className={`absolute text-[10px] font-bold ${
                                    result.stressLevel === 'HIGH' ? 'text-red-400' : 
                                    result.stressLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                    {result.stressLevel}
                                </div>
                            </div>

                            {/* Explanation Text */}
                            <div className="flex-1 border-l border-white/10 pl-4">
                                 <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Analysis Insight</p>
                                 <p className="text-sm text-gray-200 leading-snug">"{result.explanation}"</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button 
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] font-bold text-white shadow-lg btn-glow disabled:opacity-50 disabled:cursor-not-allowed z-10 flex items-center justify-center gap-2 group"
            >
                {isAnalyzing ? (
                    'ANALYZING...'
                ) : (
                    <>
                        <div className="icon-zap group-hover:text-yellow-200 transition-colors"></div>
                        {result ? 'RE-ANALYZE COGNITIVE LOAD' : 'ANALYZE COGNITIVE LOAD'}
                    </>
                )}
            </button>
            
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--primary-color)_0%,_transparent_70%)] opacity-5 pointer-events-none"></div>
        </div>
    );
}