import React, { useState } from 'react';
import { FaRocket, FaHandshake, FaBuilding, FaGraduationCap, FaGlobe, FaCheckCircle, FaClock, FaArrowRight } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

function Roadmap() {
    const phases = [
        {
            id: 1,
            title: 'Foundation Phase',
            subtitle: '국제 인재 정착',
            date: '2025.12',
            status: 'current',
            icon: FaRocket,
            description: '10명의 해외 기업가를 부산에 정착시켜 국제 비즈니스 협업의 기반을 마련합니다.',
            progress: 30,
            milestones: [
                { text: '해외 기업가 초청 프로그램 시작', completed: true },
                { text: '비자 및 행정 절차 지원 시스템 구축', completed: true },
                { text: '멘토링 프로그램 론칭', completed: false },
                { text: '10명의 기업가 정착 완료', completed: false }
            ]
        },
        {
            id: 2,
            title: 'Partnership Phase',
            subtitle: '국제 MOU 체결',
            date: '2026.01',
            status: 'upcoming',
            icon: FaHandshake,
            description: '국제 기관 및 정부와의 공식 파트너십을 MOU 협정을 통해 수립합니다.',
            progress: 0,
            milestones: [
                { text: '국제 벤처 투자 협회와 MOU 체결', completed: false },
                { text: '해외 정부 기관과 협력 체계 구축', completed: false },
                { text: '대학 및 연구기관과 파트너십 확대', completed: false },
                { text: '5개 이상의 MOU 체결 완료', completed: false }
            ]
        },
        {
            id: 3,
            title: 'Expansion Phase',
            subtitle: '한국 법인 설립',
            date: '2026.06',
            status: 'upcoming',
            icon: FaBuilding,
            description: '국제 기업들의 한국 법인 설립을 지원하고 투자 프로젝트를 시작합니다.',
            progress: 0,
            milestones: [
                { text: '법인 설립 지원 프로그램 시작', completed: false },
                { text: '첫 번째 국제 기업 한국 법인 설립', completed: false },
                { text: '투자 프로젝트 10개 이상 개시', completed: false },
                { text: '법인 설립 지원센터 운영', completed: false }
            ]
        },
        {
            id: 4,
            title: 'Development Phase',
            subtitle: '지속 가능한 성장 및 교육',
            date: '2026.12',
            status: 'upcoming',
            icon: FaGraduationCap,
            description: '지속적인 인재 양성과 창출된 수익의 재투자를 통해 지속 가능한 성장을 보장합니다.',
            progress: 0,
            milestones: [
                { text: '인재 양성 프로그램 확대', completed: false },
                { text: '연구개발 투자 강화', completed: false },
                { text: '재투자 시스템 구축', completed: false },
                { text: '자립형 생태계 구축 완료', completed: false }
            ]
        },
        {
            id: 5,
            title: 'Globalization Phase',
            subtitle: '국제 프로그램 확장',
            date: '2027.01',
            status: 'upcoming',
            icon: FaGlobe,
            description: '성공한 부산 모델을 다른 글로벌 도시로 확장하여 전 세계 비즈니스 허브 네트워크를 구축합니다.',
            progress: 0,
            milestones: [
                { text: '첫 번째 해외 도시에 모델 확장', completed: false },
                { text: '글로벌 네트워크 플랫폼 구축', completed: false },
                { text: '10개 이상의 도시에 프로그램 확장', completed: false },
                { text: '전 세계 비즈니스 허브 네트워크 완성', completed: false }
            ]
        }
    ];

    useGSAP(() => {
        try {
            const roadmapStages = document.querySelectorAll('.roadmap-stage');
            const roadmapSection = document.querySelector('.roadmap-section');
            
            if (roadmapStages.length > 0 && roadmapSection) {
                gsap.fromTo('.roadmap-stage', 
                    { opacity: 0, x: -50 },
                    { 
                        opacity: 1, 
                        x: 0, 
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: roadmapSection,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        } catch (error) {
            console.warn('Roadmap page animation error:', error);
        }
    }, []);

    const { t } = useTranslation();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
            <SEO
                title={t('roadmap.title') + ' - Global BUSAN'}
                description={t('roadmap.heroDescription')}
                keywords="로드맵, 프로젝트 로드맵, 부산 발전, 단계별 계획, 마일스톤"
                url="https://globalbusan.xyz/roadmap"
            />
            <Navbar />
            <main className="pt-20">
                <section className="roadmap-section py-20">
                    <div className="container mx-auto px-5 sm:px-10">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8">
                                Project <span className="text-blue-300">Roadmap</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                                부산을 글로벌 비즈니스 허브로 변화시키는 종합적인 5단계 로드맵입니다.
                                각 단계는 이전 단계를 기반으로 구축되어 국제 협업을 위한 지속 가능한 생태계를 만듭니다.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="max-w-6xl mx-auto">
                            <div className="space-y-12">
                                {phases.map((phase) => {
                                    const IconComponent = phase.icon;
                                    return (
                                        <div key={phase.id} className="roadmap-stage relative">
                                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
                                                <div className="flex items-start space-x-8">
                                                    {/* Timeline Dot */}
                                                    <div className="flex-shrink-0 relative">
                                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                                                            phase.status === 'current' 
                                                                ? 'bg-blue-500 border-blue-500' 
                                                                : phase.status === 'upcoming'
                                                                ? 'bg-white/20 border-white/30'
                                                                : 'bg-green-500 border-green-500'
                                                        }`}>
                                                            <IconComponent className={`text-2xl ${
                                                                phase.status === 'current' 
                                                                    ? 'text-white' 
                                                                    : phase.status === 'upcoming'
                                                                    ? 'text-white/70'
                                                                    : 'text-white'
                                                            }`} />
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-4 flex-wrap">
                                                            <div>
                                                                <h3 className="text-3xl font-bold text-white mb-2">
                                                                    Phase {phase.id}: {phase.title}
                                                                </h3>
                                                                <p className="text-xl text-blue-200 mb-2">{phase.subtitle}</p>
                                                                <p className="text-lg text-blue-300 flex items-center">
                                                                    <FaClock className="mr-2" />
                                                                    목표 날짜: {phase.date}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-lg text-blue-200 mb-1">진행률</div>
                                                                <div className="text-3xl font-bold text-white">{phase.progress}%</div>
                                                            </div>
                                                        </div>

                                                        <p className="text-lg text-blue-100 mb-6">{phase.description}</p>

                                                        {/* Progress Bar */}
                                                        <div className="mb-6">
                                                            <div className="w-full bg-white/20 rounded-full h-4">
                                                                <div 
                                                                    className="h-4 bg-blue-500 rounded-full transition-all duration-1000"
                                                                    style={{ width: `${phase.progress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        {/* Milestones */}
                                                        <div className="mt-6">
                                                            <h4 className="text-xl font-bold text-white mb-4">주요 마일스톤</h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {phase.milestones.map((milestone, idx) => (
                                                                    <div 
                                                                        key={idx}
                                                                        className={`flex items-center gap-3 p-3 rounded-lg ${
                                                                            milestone.completed 
                                                                                ? 'bg-green-500/20 border border-green-500/30' 
                                                                                : 'bg-white/5 border border-white/10'
                                                                        }`}
                                                                    >
                                                                        {milestone.completed ? (
                                                                            <FaCheckCircle className="text-green-400 text-lg flex-shrink-0" />
                                                                        ) : (
                                                                            <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex-shrink-0"></div>
                                                                        )}
                                                                        <span className={`text-sm ${
                                                                            milestone.completed ? 'text-green-200 line-through' : 'text-blue-200'
                                                                        }`}>
                                                                            {milestone.text}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Roadmap;



