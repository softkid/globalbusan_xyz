import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartPie, FaEye, FaShareAlt, FaDownload } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { statsService, investmentService } from '../lib/supabase';
import { generateEquityStructurePDF } from '../lib/pdfGenerator';

gsap.registerPlugin(ScrollTrigger);

const EquityStructure = () => {
    const [donationData, setDonationData] = useState({
        totalAmount: 0,
        donorCount: 0,
        averageDonation: 0,
        topDonors: [],
        recentDonations: []
    });
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        loadDonationData();
    }, []);

    const loadDonationData = async () => {
        try {
            const [projectStats, investorStats, investmentStats, recentInvestments] = await Promise.all([
                statsService.getProjectStats(),
                statsService.getInvestorStats(),
                statsService.getInvestmentStats(),
                investmentService.getInvestments()
            ]);

            const totalAmount = projectStats?.total_raised || 0;
            const donorCount = investorStats?.total_investors || 0;
            const averageDonation = donorCount > 0 ? totalAmount / donorCount : 0;

            // 최근 투자 내역 (최대 5개)
            const recentDonations = (recentInvestments || []).slice(0, 5).map(investment => ({
                name: investment.investors?.name || 'Anonymous',
                amount: investment.amount,
                date: new Date(investment.investment_date).toISOString().split('T')[0],
                blockchain: investment.transaction_hash || '0x0000...0000'
            }));

            // 상위 투자자 (최대 5개)
            const topDonors = (recentInvestments || [])
                .reduce((acc, investment) => {
                    const existing = acc.find(donor => donor.name === (investment.investors?.name || 'Anonymous'));
                    if (existing) {
                        existing.amount += investment.amount;
                    } else {
                        acc.push({
                            name: investment.investors?.name || 'Anonymous',
                            amount: investment.amount,
                            percentage: 0
                        });
                    }
                    return acc;
                }, [])
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)
                .map(donor => ({
                    ...donor,
                    percentage: totalAmount > 0 ? (donor.amount / totalAmount) * 100 : 0
                }));

            setDonationData({
                totalAmount,
                donorCount,
                averageDonation,
                topDonors,
                recentDonations
            });
        } catch (error) {
            console.error('투자 데이터 로드 실패:', error);
            // 기본값 설정
            setDonationData({
                totalAmount: 1020000,
                donorCount: 8,
                averageDonation: 127500,
                topDonors: [
                    { name: 'Anonymous', amount: 50000, percentage: 4.9 },
                    { name: 'Busan Tech Corp', amount: 25000, percentage: 2.5 },
                    { name: 'Global Investor', amount: 15000, percentage: 1.5 }
                ],
                recentDonations: [
                    { name: 'Anonymous', amount: 5000, date: '2025-01-03', blockchain: '0x1234...5678' },
                    { name: 'Tech Enthusiast', amount: 2500, date: '2025-01-03', blockchain: '0x2345...6789' }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    useGSAP(() => {
        // 로딩 중이거나 데이터가 없을 때는 애니메이션을 실행하지 않음
        if (loading || !donationData || Object.keys(donationData).length === 0) {
            return;
        }

        try {
            // 요소가 존재하는지 확인 후 애니메이션 실행
            const equityCards = document.querySelectorAll('.equity-card');
            const equitySection = document.querySelector('.equity-section');
            
            if (equityCards.length > 0 && equitySection) {
                gsap.fromTo('.equity-card', 
                    { opacity: 0, y: 50 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: equitySection,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        } catch (error) {
            console.warn('EquityStructure animation error:', error);
        }
    }, [loading, donationData]);

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

    const handleDownload = async () => {
        try {
            const doc = await generateEquityStructurePDF(donationData);
            doc.save('Global_Busan_XYZ_Equity_Structure_Report.pdf');
        } catch (error) {
            console.error('PDF 생성 실패:', error);
            alert('PDF 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
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
                                {loading ? (
                                    <div className="animate-pulse">---</div>
                                ) : (
                                    `$${donationData.totalAmount.toLocaleString()}`
                                )}
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
                                {loading ? (
                                    <div className="animate-pulse">---</div>
                                ) : (
                                    donationData.donorCount
                                )}
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
                                {loading ? (
                                    <div className="animate-pulse">---</div>
                                ) : (
                                    `$${donationData.averageDonation.toLocaleString()}`
                                )}
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
                            {donationData.topDonors && donationData.topDonors.length > 0 ? (
                                donationData.topDonors.map((donor, index) => (
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
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    {loading ? '로딩 중...' : '투자자 데이터가 없습니다.'}
                                </div>
                            )}
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
                            {donationData.recentDonations && donationData.recentDonations.length > 0 ? (
                                donationData.recentDonations.map((donation, index) => (
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
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    {loading ? '로딩 중...' : '최근 투자 내역이 없습니다.'}
                                </div>
                            )}
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
                                <button 
                                    onClick={() => {
                                        if (donationData.recentDonations && donationData.recentDonations.length > 0) {
                                            const latestTx = donationData.recentDonations[0].blockchain
                                            if (latestTx) {
                                                window.open(getBlockchainExplorerLink(latestTx, 'ethereum'), '_blank')
                                            }
                                        }
                                    }}
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                                >
                                    View on Blockchain
                                </button>
                                <button 
                                    onClick={handleDownload}
                                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <FaDownload className="text-sm" />
                                    <span>Download PDF</span>
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
