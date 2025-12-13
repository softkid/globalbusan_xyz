import React, { useState, useEffect } from 'react';
import { FaDownload, FaCalendarAlt, FaChartBar, FaFilePdf, FaShareAlt } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { statsService, expenseService } from '../lib/supabase';
import { generateReportPDF } from '../lib/pdfGenerator';

gsap.registerPlugin(ScrollTrigger);

const Reports = () => {
    const [selectedQuarter, setSelectedQuarter] = useState('Q3-2025');
    const [reportData, setReportData] = useState({});
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = async () => {
        try {
            const [projectStats, expenseStats] = await Promise.all([
                statsService.getProjectStats(),
                statsService.getProjectExpenseStats()
            ]);

            const totalRaised = projectStats?.total_raised || 0;
            const totalExpenses = expenseStats?.reduce((sum, stat) => sum + stat.total_expenses, 0) || 0;

            setReportData({
                'Q3-2025': {
                    title: 'Q3 2025 Progress Report',
                    period: 'July - September 2025',
                    fundsReceived: totalRaised,
                    fundsSpent: totalExpenses,
                    milestones: [
                        { title: 'International Partnership MOU Signed', status: 'completed', progress: 100 },
                        { title: 'Busan Office Space Secured', status: 'completed', progress: 100 },
                        { title: 'First International Team Member Onboarded', status: 'completed', progress: 100 },
                        { title: 'Blockchain Integration Completed', status: 'in-progress', progress: 85 },
                        { title: 'Community Building Initiative Launched', status: 'in-progress', progress: 60 }
                    ],
                    impactMetrics: {
                        internationalPartnerships: 3,
                        teamMembers: projectStats?.total_team_members || 0,
                        communityMembers: 1250,
                        socialMediaReach: 45000
                    },
                    financialBreakdown: {
                        development: totalExpenses * 0.6,
                        marketing: totalExpenses * 0.15,
                        infrastructure: totalExpenses * 0.15,
                        legal: totalExpenses * 0.05,
                        operations: totalExpenses * 0.05
                    },
                    nextQuarterGoals: [
                        'Complete blockchain integration',
                        'Launch community platform',
                        'Establish 5 new international partnerships',
                        'Reach 2000 community members'
                    ]
                },
                'Q2-2025': {
                    title: 'Q2 2025 Progress Report',
                    period: 'April - June 2025',
                    fundsReceived: totalRaised * 0.7,
                    fundsSpent: totalExpenses * 0.7,
                    milestones: [
                        { title: 'Project Planning Completed', status: 'completed', progress: 100 },
                        { title: 'Team Assembly Started', status: 'completed', progress: 100 },
                        { title: 'Initial Funding Secured', status: 'completed', progress: 100 },
                        { title: 'Office Space Research', status: 'completed', progress: 100 },
                        { title: 'Partnership Discussions', status: 'in-progress', progress: 75 }
                    ],
                    impactMetrics: {
                        internationalPartnerships: 1,
                        teamMembers: Math.floor((projectStats?.total_team_members || 0) * 0.6),
                        communityMembers: 500,
                        socialMediaReach: 15000
                    },
                    financialBreakdown: {
                        development: totalExpenses * 0.5,
                        marketing: totalExpenses * 0.2,
                        infrastructure: totalExpenses * 0.2,
                        legal: totalExpenses * 0.05,
                        operations: totalExpenses * 0.05
                    },
                    nextQuarterGoals: [
                        'Complete team assembly',
                        'Secure office space',
                        'Sign first international partnership',
                        'Launch community building'
                    ]
                }
            });
        } catch (error) {
            console.error('리포트 데이터 로드 실패:', error);
            // 기본값 설정
            setReportData({
                'Q3-2025': {
                    title: 'Q3 2025 Progress Report',
                    period: 'July - September 2025',
                    fundsReceived: 450000,
                    fundsSpent: 320000,
                    milestones: [
                        { title: 'International Partnership MOU Signed', status: 'completed', progress: 100 },
                        { title: 'Busan Office Space Secured', status: 'completed', progress: 100 },
                        { title: 'First International Team Member Onboarded', status: 'completed', progress: 100 },
                        { title: 'Blockchain Integration Completed', status: 'in-progress', progress: 85 },
                        { title: 'Community Building Initiative Launched', status: 'in-progress', progress: 60 }
                    ],
                    impactMetrics: {
                        internationalPartnerships: 3,
                        teamMembers: 8,
                        communityMembers: 1250,
                        socialMediaReach: 45000
                    },
                    financialBreakdown: {
                        development: 192000,
                        marketing: 48000,
                        infrastructure: 48000,
                        legal: 16000,
                        operations: 16000
                    },
                    nextQuarterGoals: [
                        'Complete blockchain integration',
                        'Launch community platform',
                        'Establish 5 new international partnerships',
                        'Reach 2000 community members'
                    ]
                },
                'Q2-2025': {
                    title: 'Q2 2025 Progress Report',
                    period: 'April - June 2025',
                    fundsReceived: 315000,
                    fundsSpent: 224000,
                    milestones: [
                        { title: 'Project Planning Completed', status: 'completed', progress: 100 },
                        { title: 'Team Assembly Started', status: 'completed', progress: 100 },
                        { title: 'Initial Funding Secured', status: 'completed', progress: 100 },
                        { title: 'Office Space Research', status: 'completed', progress: 100 },
                        { title: 'Partnership Discussions', status: 'in-progress', progress: 75 }
                    ],
                    impactMetrics: {
                        internationalPartnerships: 1,
                        teamMembers: 5,
                        communityMembers: 500,
                        socialMediaReach: 15000
                    },
                    financialBreakdown: {
                        development: 112000,
                        marketing: 44800,
                        infrastructure: 44800,
                        legal: 11200,
                        operations: 11200
                    },
                    nextQuarterGoals: [
                        'Complete team assembly',
                        'Secure office space',
                        'Sign first international partnership',
                        'Launch community building'
                    ]
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const currentReport = reportData[selectedQuarter] || {};

    useGSAP(() => {
        // 로딩 중이거나 데이터가 없을 때는 애니메이션을 실행하지 않음
        if (loading || !currentReport || Object.keys(currentReport).length === 0) {
            return;
        }

        try {
            // 요소가 존재하는지 확인 후 애니메이션 실행
            const reportCards = document.querySelectorAll('.report-card');
            const reportsSection = document.querySelector('.reports-section');
            
            if (reportCards.length > 0 && reportsSection) {
                gsap.fromTo('.report-card', 
                    { opacity: 0, y: 50 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: reportsSection,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        } catch (error) {
            console.warn('Reports animation error:', error);
        }
    }, [loading, currentReport]);

    const handleDownload = async () => {
        try {
            const doc = await generateReportPDF(currentReport, selectedQuarter);
            doc.save(`Global_Busan_XYZ_${selectedQuarter}_Report.pdf`);
        } catch (error) {
            console.error('PDF 생성 실패:', error);
            alert('PDF 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Global Busan XYZ - ${currentReport.title}`,
            text: `Check out our ${selectedQuarter} progress report! Total raised: $${currentReport.fundsReceived?.toLocaleString() || 0}`,
            url: window.location.href
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: 클립보드에 복사
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                alert('링크가 클립보드에 복사되었습니다!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                // 사용자가 공유를 취소한 경우가 아닐 때만 에러 처리
                try {
                    await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                    alert('링크가 클립보드에 복사되었습니다!');
                } catch (clipboardError) {
                    console.error('공유 실패:', error);
                    alert('공유 기능을 사용할 수 없습니다.');
                }
            }
        }
    };

    if (loading) {
        return (
            <section id="reports" className="py-20 bg-gray-50">
                <div className="container mx-auto px-5 sm:px-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <div className="text-xl text-gray-600">리포트를 불러오는 중...</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="reports" className="reports-section py-20 bg-gradient-to-br from-gray-50 to-slate-100">
            <div className="container mx-auto px-5 sm:px-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8">
                        Project <span className="text-green-600">Reports</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Quarterly progress reports showcasing transparent fund usage, milestone achievements, 
                        and impact metrics. Stay informed about how your donations are making a difference.
                    </p>
                </div>

                {/* Quarter Selector */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                        {reportData && Object.keys(reportData).length > 0 ? (
                            Object.keys(reportData).map((quarter) => (
                                <button
                                    key={quarter}
                                    onClick={() => setSelectedQuarter(quarter)}
                                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                        selectedQuarter === quarter
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {quarter}
                                </button>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-4">
                                {loading ? '로딩 중...' : '리포트 데이터가 없습니다.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Content */}
                <div className="max-w-6xl mx-auto">
                    {/* Report Header */}
                    <div className="report-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">{currentReport.title}</h3>
                                <p className="text-gray-600 flex items-center">
                                    <FaCalendarAlt className="mr-2" />
                                    {currentReport.period}
                                </p>
                            </div>
                            <div className="flex space-x-4">
                                <button 
                                    onClick={handleDownload}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                                >
                                    <FaDownload />
                                    <span>Download PDF</span>
                                </button>
                                <button 
                                    onClick={handleShare}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                                >
                                    <FaShareAlt />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Financial Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="report-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <FaChartBar className="mr-3 text-green-600" />
                                Financial Overview
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                    <span className="text-gray-700">Funds Received</span>
                                    <span className="font-bold text-green-600">${currentReport.fundsReceived.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                    <span className="text-gray-700">Funds Spent</span>
                                    <span className="font-bold text-blue-600">${currentReport.fundsSpent.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                    <span className="text-gray-700">Remaining Balance</span>
                                    <span className="font-bold text-purple-600">
                                        ${(currentReport.fundsReceived - currentReport.fundsSpent).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="report-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h4 className="text-2xl font-bold text-gray-900 mb-6">Impact Metrics</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{currentReport.impactMetrics.internationalPartnerships}</div>
                                    <div className="text-sm text-gray-600">International Partnerships</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{currentReport.impactMetrics.teamMembers}</div>
                                    <div className="text-sm text-gray-600">Team Members</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{currentReport.impactMetrics.communityMembers.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Community Members</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{currentReport.impactMetrics.socialMediaReach.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Social Media Reach</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="report-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">Project Milestones</h4>
                        <div className="space-y-4">
                            {currentReport.milestones && currentReport.milestones.length > 0 ? (
                                currentReport.milestones.map((milestone, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full mr-4 ${
                                                milestone.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></div>
                                            <span className="text-gray-900 font-medium">{milestone.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${milestone.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-600">{milestone.progress}%</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    {loading ? '로딩 중...' : '마일스톤 데이터가 없습니다.'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Key Achievements and Next Goals */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="report-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h4 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h4>
                            <ul className="space-y-3">
                                {currentReport.keyAchievements && currentReport.keyAchievements.length > 0 ? (
                                    currentReport.keyAchievements.map((achievement, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-gray-700">{achievement}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center text-gray-500 py-4">
                                        {loading ? '로딩 중...' : '주요 성과 데이터가 없습니다.'}
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="report-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <h4 className="text-2xl font-bold text-gray-900 mb-6">Next Quarter Goals</h4>
                            <ul className="space-y-3">
                                {currentReport.nextQuarterGoals && currentReport.nextQuarterGoals.length > 0 ? (
                                    currentReport.nextQuarterGoals.map((goal, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-gray-700">{goal}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center text-gray-500 py-4">
                                        {loading ? '로딩 중...' : '다음 분기 목표 데이터가 없습니다.'}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reports;
