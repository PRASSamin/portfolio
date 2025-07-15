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
  enabled: true,
  end: {
    date: "2025-04-30",
    probability: "low",
  },
  message: (
    <span className="text-gray-300 leading-relaxed">
      <span className="text-purple-400 font-bold text-xl">PRAS Samin</span> is
      currently upgrading this site to deliver a more powerful, personal, and
      polished experience.
      <br />
      <br />
      This domain is the official digital identity of{" "}
      <span className="text-cyan-400 font-semibold">PRAS</span> — developer,
      open-source creator.
      <br />
      <br />
      <span className="text-yellow-400 font-semibold">
        Migration is in progress...
      </span>{" "}
      but the grind never stops.
    </span>
  ),
  additionalInfo: (
    <div className="mt-6">
      <span className="text-purple-400 font-bold text-lg">
        In the Meantime:
      </span>
      <ul className="mt-3 text-gray-300 list-disc list-inside space-y-2">
        <li>
          GitHub:{" "}
          <a
            className="text-blue-400 hover:underline"
            href="https://github.com/PRASSamin"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/prassamin
          </a>
        </li>
        <li>
          Contact:{" "}
          <a
            className="text-blue-400 hover:underline"
            href="mailto:prassamin@gmail.com"
          >
            prassamin@gmail.com
          </a>
        </li>
        <li className="italic text-gray-400">
          This domain verifies that I am PRAS. No clone, no placeholder — just
          me.
        </li>
      </ul>
    </div>
  ),
};
