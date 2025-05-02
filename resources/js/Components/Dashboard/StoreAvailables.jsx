import React from 'react';
import { Sparkles, User, Image } from 'lucide-react';

const storeItems = [
  {
    type: 'Title',
    icon: <Sparkles className="w-5 h-5 text-blue-500" />,
    items: ['Code Master', 'Bug Slayer', 'Algorithm Ace'],
  },
  {
    type: 'Avatar',
    icon: <Image className="w-5 h-5 text-purple-500" />,
    items: ['Pixel Cat', 'Cyber Samurai', 'AI Nerd'],
  },
];

const StoreAvailables = () => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Store Availables</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {storeItems.map((section, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-[#2a2a2a] p-4 rounded-xl shadow hover:bg-gray-200 dark:hover:bg-[#333] transition"
          >
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreAvailables;
