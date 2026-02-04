'use client';

import { useState } from 'react';
import { Lock, Crown } from 'lucide-react';

const PROJECTS = [
  { id: '1', title: 'Project 1', location: 'Damascus', budget: 5000 },
  { id: '2', title: 'Project 2', location: 'Aleppo', budget: 8000 },
  { id: '3', title: 'Project 3', location: 'Homs', budget: 3000 },
];

export default function AvailableProjects() {
  const [userPlan] = useState({ type: 'FREE', canViewFull: false });
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Available Projects</h2>
        
        {userPlan.type === 'FREE' && (
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full">
              <Crown className="w-4 h-4" />
              Free Plan - 3 views daily
            </span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <div 
              key={project.id}
              onClick={() => !userPlan.canViewFull && setShowUpgrade(true)}
              className="bg-white rounded-xl border p-6 cursor-pointer hover:shadow-lg"
            >
              <h3 className={`font-bold text-lg mb-2 ${!userPlan.canViewFull && 'blur-sm'}`}>
                {userPlan.canViewFull ? project.title : 'Project Title Hidden'}
              </h3>
              <p className="text-gray-600 mb-4">{project.location}</p>
              
              {!userPlan.canViewFull ? (
                <div className="relative h-20 bg-gray-100 rounded">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Lock className="w-6 h-6 text-purple-600 mb-1" />
                    <span className="text-xs">Upgrade to view</span>
                  </div>
                </div>
              ) : (
                <p className="text-green-600 font-bold">${project.budget}</p>
              )}
            </div>
          ))}
        </div>

        {showUpgrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-96 text-center">
              <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600 mb-4">View all project details</p>
              <button className="w-full py-2 bg-purple-600 text-white rounded-lg mb-2">
                Upgrade Now - $29/month
              </button>
              <button onClick={() => setShowUpgrade(false)} className="text-gray-600">
                Later
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
