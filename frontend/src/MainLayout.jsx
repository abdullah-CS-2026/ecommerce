import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

export const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            {/*
              The navbar is fixed, so main needs top padding that matches
              its real rendered height (delivery banner + nav row) at each
              breakpoint, or content gets clipped underneath it.
            */}
            <main className="flex-grow pt-[96px] md:pt-[112px] pb-10">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};