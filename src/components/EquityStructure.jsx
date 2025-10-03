import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartPie, FaEye, FaShareAlt } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const EquityStructure = () => {
    const [donationData, setDonationData] = useState({
        totalAmount: 1250000,
        donorCount: 342,
        averageDonation: 3655,
        topDonors: [
            { name: 'Anonymous', amount: 50000, percentage: 4.0 },
            { name: 'Busan Tech Corp', amount: 25000, percentage: 2.0 },
            { name: 'Global Investor', amount: 15000, percentage: 1.2 },
            { name: 'Startup Korea', amount: 12000, percentage: 1.0 },
            { name: 'Anonymous', amount: 10000, percentage: 0.8 }
        ],
        recentDonations: [
            { name: 'Anonymous', amount: 5000, date: '2025-10-03', blockchain: '0x1234...5678' },
            { name: 'Tech Enthusiast', amount: 2500, date: '2025-10-03', blockchain: '0x2345...6789' },
            { name: 'Anonymous', amount: 1000, date: '2025-10-02', blockchain: '0x3456...7890' },
            { name: 'Business Leader', amount: 7500, date: '2025-10-02', blockchain: '0x4567...8901' },
            { name: 'Anonymous', amount: 3000, date: '2025-10-01', blockchain: '0x5678...9012' }
        ]
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setDonationData(prev => ({
                ...prev,
                totalAmount: prev.totalAmount + Math.random() * 1000,
                donorCount: prev.donorCount + Math.floor(Math.random() * 2)
            }));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        gsap.fromTo('.equity-card', 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.equity-section',
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Global Busan XYZ - Equity Structure',
                text: 'Check out the transparent donation tracking for Global Busan XYZ project!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <section id="equity" className="equity-section py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-5 sm:px-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8">
                        Equity <span className="text-blue-600">Structure</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Transparent, blockchain-verified donation tracking. See exactly how your contributions 
                        are making a difference in transforming Busan into a global business hub.
                    </p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="equity-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <FaChartPie className="text-2xl text-green-600" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900 mb-3">
                                ${donationData.totalAmount.toLocaleString()}
                            </div>
                            <div className="text-xl text-gray-600">Total Donations</div>
                        </div>
                    </div>

                    <div className="equity-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUsers className="text-2xl text-blue-600" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900 mb-3">
                                {donationData.donorCount}
                            </div>
                            <div className="text-xl text-gray-600">Active Donors</div>
                        </div>
                    </div>

                    <div className="equity-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaEye className="text-2xl text-purple-600" />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900 mb-3">
                                ${donationData.averageDonation.toLocaleString()}
                            </div>
                            <div className="text-xl text-gray-600">Average Donation</div>
                        </div>
                    </div>
                </div>

                {/* Charts and Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Donation Distribution */}
                    <div className="equity-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Donation Distribution</h3>
                        <div className="space-y-4">
                            {donationData.topDonors.map((donor, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                                        <span className="text-gray-700">{donor.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">${donor.amount.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">{donor.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Others</span>
                                <span className="font-semibold text-gray-900">89.0%</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Donations */}
                    <div className="equity-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h3>
                        <div className="space-y-4">
                            {donationData.recentDonations.map((donation, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="font-semibold text-gray-900">{donation.name}</div>
                                        <div className="text-sm text-gray-500">{donation.date}</div>
                                        <div className="text-xs text-blue-600 font-mono">{donation.blockchain}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-600">${donation.amount.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Blockchain Verification */}
                <div className="equity-card mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Blockchain Verified</h3>
                            <p className="text-blue-100 mb-4">
                                All donations are recorded on the blockchain for complete transparency and verification.
                            </p>
                            <div className="flex items-center space-x-4">
                                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                                    View on Blockchain
                                </button>
                                <button 
                                    onClick={handleShare}
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <FaShareAlt className="text-sm" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EquityStructure;
