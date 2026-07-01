import { User, Lock, MapPin, Package, Heart } from "lucide-react";

export const ProfileTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "password", label: "Security", icon: Lock },
        { id: "addresses", label: "Addresses", icon: MapPin },
        { id: "orders", label: "Orders", icon: Package },
        { id: "wishlist", label: "Wishlist", icon: Heart },
    ];

    return (
        <div className="flex border-b border-slate-200">
            {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === tab.id
                            ? "text-primary border-b-2 border-primary"
                            : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        <Icon size={20} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

