"use client";
import dynamic from 'next/dynamic';
import PasswordPage from './login/page';
import { useState } from 'react';

const IndiaMap = dynamic(() => import("./components/IndiaMap/indiaMap"), { ssr: false });
const HeatMap = dynamic(() => import("./components/heatmap/heatmap"), { ssr: false });

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeBtn, setActiveBtn] = useState<string | null>("heatmap1");

    const handlePasswordSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleButtonClick = (btnName: string) => {
        setActiveBtn(btnName);
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <div className="flex justify-between p-2 gap-3">
                        <button
                            type="button"
                            className={`w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border ${activeBtn === 'heatmap1' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 shadow-sm'
                                } font-semibold border-transparent hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800`}
                            onClick={() => handleButtonClick('heatmap1')}
                        >
                            Heatmap (Growth Q1&apos;23 v/s Q1&apos;24)
                        </button>
                        <button
                            type="button"
                            className={`w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border ${activeBtn === 'heatmap2' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 shadow-sm'
                                } font-semibold border-transparent hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800`}
                            onClick={() => handleButtonClick('heatmap2')}
                        >
                            Heatmap (Aug Target v/s Prediction)
                        </button>
                    </div>
                    {activeBtn === 'heatmap1' && <IndiaMap />}
                    {activeBtn === 'heatmap2' && <HeatMap />}
                </div>
            ) : (
                <PasswordPage onSuccess={handlePasswordSuccess} />
            )}
        </div>
    );
}
