import React from "react";

interface MaintenanceNotice {
  enabled: boolean;
  message: React.ReactNode;
  end: {
    date: string;
    probability: "low" | "high";
  };
  additionalInfo?: React.ReactNode;
}

export const maintenanceNotice: MaintenanceNotice = {
  enabled: false,
  end: {
    date: "2025-02-15",
    probability: "high",
  },
  message: (
    <span className="text-gray-300 leading-relaxed">
      Our platform is currently undergoing{" "}
      <span className="text-purple-400 font-semibold">
        scheduled maintenance{" "}
      </span>
      to bring you the next generation of innovation. This major update will
      introduce{" "}
      <span className="text-cyan-400 font-semibold">
        significant enhancements,{" "}
      </span>
      ensuring a{" "}
      <span className="text-green-400 font-semibold">seamless experience </span>
      with superior{" "}
      <span className="text-yellow-400 font-semibold">performance</span>.
      <br />
      <br />
      <span className="text-gray-400 italic">
        We appreciate your patience and can&apos;t wait to unveil what&apos;s
        coming!
      </span>
    </span>
  ),
  additionalInfo: (
    <div>
      <span className="text-purple-400 font-bold text-lg">
        🚀 Next Release Highlights
      </span>
      <ul className="mt-3 text-gray-300 list-disc list-inside space-y-2">
        <li>
          🔥 <span className="text-pink-400 font-semibold">Revamped UI</span> -
          A modern and sleek design for a better user experience.
        </li>
        <li>
          ⚡{" "}
          <span className="text-blue-400 font-semibold">
            Maximized Performance
          </span>{" "}
          - Blazing fast speeds with optimized efficiency.
        </li>
        <li>
          💬{" "}
          <span className="text-green-400 font-semibold">
            Real-time Chat System
          </span>{" "}
          - Seamless communication with instant messaging.
        </li>
        <li>
          🤖{" "}
          <span className="text-yellow-400 font-semibold">AI-Powered Chat</span>{" "}
          - Smart conversations with AI integration.
        </li>
        <li>
          🔒{" "}
          <span className="text-red-400 font-semibold">Enhanced Security</span>{" "}
          - Strengthened protection for user data.
        </li>
        <li>✨ And much more to explore!</li>
      </ul>
    </div>
  ),
};
