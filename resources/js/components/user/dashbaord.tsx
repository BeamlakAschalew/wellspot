import React, { useState, useEffect } from 'react';

// Mock Data for Recommendations and History
const RECOMMENDED_PROVIDERS = [
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    category: 'Vinyasa Flow',
    rating: '4.9',
    bio: 'Expert in mobility and breathwork.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFPVRirobPzT7iLDvvnPQ_dXNQ4-dEKZ-FxRsh7R7-eWE_H17fmHSLHcg-NtuRH6dE3e1uQM_yVS_ufEsYEfyY-NiRvst1PY1KCcaycN5Aaauyp55Wso5amre0OLqUegfpgl-ZMaaldzR7pZ3lG6gMpBSy6oUur0ghVhxCi-_AsjSA-cmyL2RqC4QYzOi_2PK8Yjp1y0HO9s9s0miNknPpJ0FLrl032S1t7Q0y0MnX67Jk0frK4jtpxKNrXZoXpV2O2k5Rk3gKuTQ'
  },
  {
    id: 'aria-sullivan',
    name: 'Aria Sullivan',
    category: 'Therapy',
    rating: '5.0',
    bio: 'Specializing in trauma-informed care.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM7iXF8jygQuLSKdo8e612V0N_308NUjqE5C9JtiluUX-eDrElbupuw7osvfLH-bQ0FY1-Tj4d1riqsSdSVRXER2vlntLS1jzmYvTn_Hq_Gz7MSvYApNVLYYpbN6kgyhtJFoFnJRRU0BpiURYpx2OoRLULJx5uUG6zp8X7vMvLcITHkosDhLAJuEwXJ6QcnLHiJ02uORxTAhw8sNZr5IyrBiupUJv-YX4pQGSiH-QptgY7liKOa-MdUzqKY7b20SwUVkP1q4NruDU'
  },
  {
    id: 'elena-r',
    name: 'Elena R.',
    category: 'Massage',
    rating: '4.8',
    bio: 'Your favorite for recovery sessions.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI1ffZPqoMAmmDtG36hZaxYEJyBKPju_Lv8uzVkCRT5h5lp8lZoTVn3WKLiGY6_ky26jEDswM0Pod_gqBAm3SaswhPO6gZP2hp7YD4c1-nSI8rc9OjkRijGrTist-gpPcW1CvSx5ESK58KscG-tC7a2jlukVu9Vc45eupveSRn_AAgayDY6Yr0l5yLYY1jvi9jS4g30EvNg--Y-mOeiWToB9z2j0gelCf-B1CaQPOD0Fw5R3VUa9ym4ge3AhmPfbl6SKWAS9mohO0'
  }
];

export default function WellnessDashboard() {
  // State Management
  const [wellnessScore, setWellnessScore] = useState(74);
  const [dashOffset, setDashOffset] = useState(440);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [showProgressToast, setShowProgressToast] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(2);
  const [bookingStatus, setBookingStatus] = useState('Tomorrow');

  // SVG Circle Stroke Animation Trigger
  useEffect(() => {
    // 440 is full circle circumference. Offset maps out the score metric
    const targetOffset = 440 - (440 * wellnessScore) / 100;
    const timer = setTimeout(() => setDashOffset(targetOffset), 150);
    return () => clearTimeout(timer);
  }, [wellnessScore]);

  const handleLogProgress = () => {
    if (wellnessScore < 100) {
      setWellnessScore(prev => Math.min(prev + 4, 100));
      setShowProgressToast(true);
      setTimeout(() => setShowProgressToast(false), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

        {/* Top Notification Toast */}
        {showProgressToast && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-emerald-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-700/50 animate-in slide-in-from-top-6 duration-300">
            <span>🎉</span>
            <p className="text-xs font-medium">Activity logged! Wellness Score updated successfully.</p>
          </div>
        )}

        {/* Dashboard Frame Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back, Sarah</h1>
            <p className="text-zinc-500 text-sm mt-1">Let's check in on your wellness goals for today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationsCount(0)}
              className="p-2.5 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 relative transition-colors group"
            >
              <span className="material-symbols-outlined text-zinc-600 block text-[22px]">notifications</span>
              {notificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>
            <div className="h-10 w-10 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-semibold text-sm border border-emerald-900/10 shadow-sm">
              S
            </div>
          </div>
        </header>

        {/* Bento Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Bento Block 1: Wellness Radial Score Metrics */}
          <section className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/80 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-transparent opacity-60" />
            <h3 className="font-semibold text-zinc-800 mb-4 relative z-10 text-sm">Wellness Index</h3>

            <div className="relative w-40 h-40 flex items-center justify-center z-10">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-zinc-100" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="9" />
                <circle
                  className="text-emerald-700 transition-all duration-1000 ease-out"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeDasharray="440"
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-zinc-900 tracking-tight">{wellnessScore}</span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-0.5">Optimal</span>
              </div>
            </div>
            <p className="text-zinc-500 text-xs mt-4 max-w-[240px] leading-relaxed relative z-10">
              Your overall metric jumped by 4% relative to last week. Maintain this trend!
            </p>
          </section>

          {/* Bento Block 2: Upcoming Calendar Actions Cluster */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Scheduled Booking Tracking Item */}
            <section className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:border-emerald-700/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    bookingStatus === 'Canceled'
                      ? 'bg-zinc-100 text-zinc-500'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                  }`}>
                    {bookingStatus}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Deep Tissue Massage</h3>
                <p className="text-zinc-500 text-sm">with Elena Rodriguez, LMT</p>

                <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 mt-4 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 w-fit">
                  <span className="text-sm">⏰</span>
                  2:00 PM - 3:00 PM (60 Mins)
                </div>
              </div>

              <button
                onClick={() => setIsManageModalOpen(true)}
                className="w-full mt-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold transition-all active:scale-95"
              >
                Manage Booking
              </button>
            </section>

            {/* Micro Quick Interaction Suite */}
            <section className="flex flex-col gap-4">
              <button className="flex items-center justify-between p-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all group text-left">
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <span className="block font-bold text-sm">Book New Session</span>
                    <span className="block text-xs text-zinc-400 mt-0.5">Explore available wellness clinicians</span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <div className="grid grid-cols-2 gap-4 flex-1">
                <button className="p-4 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all flex flex-col items-center justify-center text-center group">
                  <span className="text-2xl mb-1.5 transition-transform group-hover:scale-110">📝</span>
                  <span className="font-semibold text-zinc-800 text-xs">Retake Quiz</span>
                </button>
                <button
                  onClick={handleLogProgress}
                  className="p-4 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all flex flex-col items-center justify-center text-center group active:scale-95"
                >
                  <span className="text-2xl mb-1.5 transition-transform group-hover:scale-110">📈</span>
                  <span className="font-semibold text-zinc-800 text-xs">Log Workout</span>
                </button>
              </div>
            </section>

          </div>

          {/* Daily Dynamic Tip Box */}
          <section className="lg:col-span-12">
            <div className="bg-emerald-50/50 border border-emerald-600/10 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-200/20">
                <span className="text-xl block">💡</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-0.5">Daily Wellness Tip</span>
                <p className="text-zinc-700 text-sm leading-relaxed font-medium">
                  "A 5-minute walk can boost your mood instantly. Taking deep breaths while you move resets your central nervous system configuration."
                </p>
              </div>
            </div>
          </section>

          {/* Recommended Horizontal Shelf */}
          <section className="lg:col-span-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-zinc-900">Recommended for You</h2>
              <button type="button" className="text-emerald-700 text-xs font-semibold hover:underline">View All Providers</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 snap-x">
              {RECOMMENDED_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="min-w-[280px] w-[280px] snap-start bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="h-40 relative bg-zinc-100">
                    <img className="w-full h-full object-cover" src={provider.img} alt={provider.name} />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-0.5 border border-zinc-200/20 shadow-sm">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-xs font-bold text-zinc-800">{provider.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block mb-2">
                        {provider.category}
                      </span>
                      <h4 className="font-bold text-zinc-900 text-base">{provider.name}</h4>
                      <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{provider.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Historic Ledger Matrix */}
          <section className="lg:col-span-12">
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6">
              <h3 className="font-bold text-zinc-900 text-base mb-4">Recent Activities</h3>
              <div className="divide-y divide-zinc-100">

                <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                      <span className="text-base">🧘</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-sm">Vinyasa Flow Class</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Completed last Tuesday</p>
                    </div>
                  </div>
                  <button type="button" className="text-emerald-700 text-xs font-bold hover:text-emerald-800">View Clinic Notes</button>
                </div>

                <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                      <span className="text-base">🍃</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-sm">Swedish Relaxation Treatment</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Completed 2 weeks ago</p>
                    </div>
                  </div>
                  <button type="button" className="text-emerald-700 text-xs font-bold hover:text-emerald-800">Book Session Again</button>
                </div>

              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Booking Cancellation & Change Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-zinc-200 max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Manage Session</h3>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6">
              You are modifying your upcoming Deep Tissue Massage reservation scheduled for tomorrow afternoon.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => { setBookingStatus('Canceled'); setIsManageModalOpen(false); }}
                className="w-full py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors hover:bg-rose-100"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="w-full py-2.5 bg-zinc-100 text-zinc-800 rounded-xl text-xs font-semibold transition-colors hover:bg-zinc-200"
              >
                Keep Current Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
