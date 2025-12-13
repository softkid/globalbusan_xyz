import React, { useEffect, useRef, useState } from 'react'
import Button from './Button';
import { FaGlobe, FaHandHoldingHeart, FaChartLine, FaBuilding, FaUsers, FaRocket } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/all";
import { Link } from 'react-router-dom';
import { statsService } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const { t } = useTranslation();
    const [donationAmount, setDonationAmount] = useState(0);
    const [donorCount, setDonorCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const heroRef = useRef(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [projectStats, investorStats, investmentStats] = await Promise.all([
                statsService.getProjectStats(),
                statsService.getInvestorStats(),
                statsService.getInvestmentStats()
            ]);

            setDonationAmount(projectStats?.total_raised || 0);
            setDonorCount(investorStats?.total_investors || 0);
            setProjectCount(projectStats?.total_projects || 0);
        } catch (error) {
            console.error('통계 데이터 로드 실패:', error);
            // 폴백 데이터 사용 (supabase.js에서 이미 처리됨)
            setDonationAmount(1020000);
            setDonorCount(8);
            setProjectCount(6);
        } finally {
            setLoading(false);
        }
    };

    useGSAP(() => {
        try {
            if (heroRef.current) {
                gsap.fromTo(heroRef.current,
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.5,
                        ease: "power2.out"
                    }
                );
            }
        } catch (error) {
            console.warn('Hero animation error:', error);
        }
    }, []);

    useGSAP(() => {
        try {
            const floatingElements = document.querySelectorAll(".floating-element");
            if (floatingElements.length > 0) {
                gsap.fromTo(".floating-element",
                    {
                        y: 0,
                        rotation: 0
                    },
                    {
                        y: -20,
                        rotation: 5,
                        duration: 3,
                        ease: "power1.inOut",
                        yoyo: true,
                        repeat: -1,
                        stagger: 0.5
                    }
                );
            }
        } catch (error) {
            console.warn('Floating element animation error:', error);
        }
    }, []);

    return (
        <div className='relative min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
                <div className="floating-element absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
                <div className="floating-element absolute bottom-40 right-1/3 w-28 h-28 bg-pink-500/20 rounded-full blur-xl"></div>
            </div>

            {/* Main Content */}
            <div ref={heroRef} className='relative z-10 min-h-screen w-screen flex items-center justify-center py-20'>
                <div className='text-center px-5 sm:px-10 max-w-6xl mx-auto'>
                    {/* Main Title */}
                    <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8'>
                        {t('home.title')}
                    </h1>

                    {/* Subtitle */}
                    <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-100 mb-8'>
                        {t('home.subtitle')}
                    </h2>

                    {/* Description */}
                    <p className='text-lg sm:text-xl md:text-2xl text-blue-200 mb-12 max-w-4xl mx-auto leading-relaxed'>
                        {t('home.description')}
                    </p>

                    {/* Stats */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
                        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
                            <div className='flex items-center justify-center mb-6'>
                                <FaBuilding className='text-4xl text-green-400' />
                            </div>
                            <div className='text-4xl font-bold text-white mb-3'>
                                {loading ? (
                                    <div className="animate-pulse">---</div>
                                ) : (
                                    `$${donationAmount.toLocaleString()}`
                                )}
                            </div>
                            <div className='text-xl text-blue-200'>{t('home.totalInvestment')}</div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
                            <div className='flex items-center justify-center mb-6'>
                                <FaUsers className='text-4xl text-blue-400' />
                            </div>
                            <div className='text-4xl font-bold text-white mb-3'>
                                {loading ? (
                                    <div className="animate-pulse">---</div>
                                ) : (
                                    `${donorCount}+`
                                )}
                            </div>
                            <div className='text-xl text-blue-200'>{t('home.globalPartners')}</div>
                        </div>

                        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
                            <div className='flex items-center justify-center mb-6'>
                                <FaRocket className='text-4xl text-purple-400' />
                            </div>
                            <div className='text-4xl font-bold text-white mb-3'>
                                {loading ? (
                                    <div className="animate-pulse">---</div>
                                ) : (
                                    projectCount
                                )}
                            </div>
                            <div className='text-xl text-blue-200'>{t('home.activeProjects')}</div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                        <Link to="/invest">
                            <Button
                                id="invest-now"
                                title={t('home.investNow')}
                                leftIcon={<FaBuilding />}
                                containerClass='!bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-10 py-5 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                            />
                        </Link>
                        <Button
                            id="learn-more"
                            title={t('home.learnMore')}
                            leftIcon={<FaRocket />}
                            containerClass='!bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 text-xl font-bold rounded-full backdrop-blur-lg transition-all duration-300'
                        />
                    </div>

                    {/* Scroll Indicator */}
                    <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
                        <div className='animate-bounce'>
                            <div className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center'>
                                <div className='w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>
        </div>
    )
}

export default Hero