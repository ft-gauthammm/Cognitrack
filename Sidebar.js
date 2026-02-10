function Sidebar({ activeTab, setActiveTab }) {
    const navItems = [
        { id: "home", label: "Home", icon: "home" },
        { id: "dashboard", label: "Dashboard", icon: "activity" },
        { id: "analytics", label: "Analytics", icon: "bar-chart" }
    ];


    return (
        <aside className="w-20 lg:w-64 glass-panel border-r border-r-white/10 flex flex-col z-10 hidden md:flex" data-name="sidebar" data-file="components/Sidebar.js">
            <div className="flex-1 py-8 flex flex-col gap-4 px-3">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                            flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
                            ${activeTab === item.id 
                                ? 'bg-[var(--primary-color)] shadow-[0_0_15px_rgba(139,92,246,0.4)] text-white' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <div className={`${item.icon} text-xl`}></div>
                        <span className="font-medium hidden lg:block">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block shadow-[0_0_5px_white]"></div>
                        )}
                    </button>
                ))}
            </div>
            
            <div className="p-4 border-t border-white/5">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="icon-cpu text-[var(--secondary-color)]"></div>
                        <span className="text-xs font-bold text-gray-300 hidden lg:block">AI ENGINE</span>
                    </div>
                    <div className="w-full bg-gray-700/50 h-1.5 rounded-full overflow-hidden hidden lg:block">
                        <div className="h-full bg-[var(--secondary-color)] w-3/4 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </aside>
    );
}