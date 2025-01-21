"use client";
import React, { useState } from "react";
import LoadingAnimation from "../../components/loader";

const TalkWithNovaView = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative w-full h-[calc(100vh-64px)]">
            {!isLoaded && (
                <div className="fixed bg-black inset-0 z-50 flex justify-center items-center">
                    <LoadingAnimation />
                </div>
            )}
            <iframe
                className={`w-[calc(100vw+2px)] h-full -translate-x-[1px] -translate-y-[1px] transition-opacity duration-300 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                }`}
                src="https://tawk.to/chat/678260b549e2fd8dfe0608af/default"
                onLoad={() => setIsLoaded(true)}
            ></iframe>
        </div>
    );
};

export default TalkWithNovaView;