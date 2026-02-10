function Header() {
    return (
        <header className="h-16 glass-panel border-b border-b-white/10 flex items-center justify-between px-6 z-20 relative" data-name="header" data-file="components/Header.js">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <div className="icon-brain-circuit text-white text-lg"></div>
                </div>
                <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    COGNITRACK <span className="text-xs font-normal text-[var(--secondary-color)] ml-1">v2.0</span>
                </h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-300">System Online</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20 flex items-center justify-center cursor-pointer hover:border-[var(--secondary-color)] transition-colors">
                    <div className="icon-user text-gray-200"></div>
                </div>
            </div>
        </header>
    );
}