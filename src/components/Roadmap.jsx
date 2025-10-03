import React, { useState } from 'react';
import { FaRocket, FaHandshake, FaBuilding, FaGraduationCap, FaGlobe, FaCheckCircle, FaClock, FaArrowRight } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Roadmap = () => {
    const stages = [
        {
            id: 1,
            title: 'Foundation Phase',
            subtitle: 'International Talent Settlement',
            date: '2025.12',
            status: 'current',
            icon: FaRocket,
            description: 'Establish foundation for international business collaboration by settling 10 overseas entrepreneurs in Busan.',
            progress: 30
        },
        {
            id: 2,
            title: 'Partnership Phase',
            subtitle: 'International MOU Signings',
            date: '2026.01',
            status: 'upcoming',
            icon: FaHandshake,
            description: 'Establish formal partnerships with international organizations and governments through MOU agreements.',
            progress: 0
        },
        {
            id: 3,
            title: 'Expansion Phase',
            subtitle: 'Korean Subsidiary Establishment',
            date: '2026.06',
            status: 'upcoming',
            icon: FaBuilding,
            description: 'Establish Korean subsidiaries of international companies and initiate investment projects.',
            progress: 0
        },
        {
            id: 4,
            title: 'Development Phase',
            subtitle: 'Sustainable Growth & Education',
            date: '2026.12',
            status: 'upcoming',
            icon: FaGraduationCap,
            description: 'Ensure sustainable growth through continuous talent development and reinvestment of generated profits.',
            progress: 0
        },
        {
            id: 5,
            title: 'Globalization Phase',
            subtitle: 'International Program Expansion',
            date: '2027.01',
            status: 'upcoming',
            icon: FaGlobe,
            description: 'Scale the successful Busan model to other global cities, creating a worldwide network of business hubs.',
            progress: 0
        }
    ];

    useGSAP(() => {
        gsap.fromTo('.roadmap-stage', 
            { opacity: 0, x: -50 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.roadmap-section',
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, []);

    return (
        <section id="roadmap" className="roadmap-section py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="container mx-auto px-5 sm:px-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8">
                        Project <span className="text-purple-600">Roadmap</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        A comprehensive 5-stage roadmap to transform Busan into a global business hub. 
                        Each stage builds upon the previous one, creating a sustainable ecosystem for international collaboration.
                    </p>
                </div>

                {/* Timeline */}
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-12">
                        {stages.map((stage, index) => {
                            const IconComponent = stage.icon;
                            return (
                                <div key={stage.id} className="roadmap-stage relative">
                                    <div className="flex items-start space-x-8 p-8 rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
                                        {/* Timeline Dot */}
                                        <div className="flex-shrink-0 relative">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                                                stage.status === 'current' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                                            }`}>
                                                <IconComponent className={`text-2xl ${
                                                    stage.status === 'current' ? 'text-white' : 'text-gray-400'
                                                }`} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                                        Stage {stage.id}: {stage.title}
                                                    </h3>
                                                    <p className="text-xl text-gray-600 mb-2">{stage.subtitle}</p>
                                                    <p className="text-lg text-gray-500 flex items-center">
                                                        <FaClock className="mr-2" />
                                                        Target Date: {stage.date}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg text-gray-500 mb-1">Progress</div>
                                                    <div className="text-3xl font-bold text-gray-900">{stage.progress}%</div>
                                                </div>
                                            </div>

                                            <p className="text-lg text-gray-700 mb-6">{stage.description}</p>

                                            {/* Progress Bar */}
                                            <div className="mb-6">
                                                <div className="w-full bg-gray-200 rounded-full h-4">
                                                    <div 
                                                        className="h-4 bg-blue-500 rounded-full transition-all duration-1000"
                                                        style={{ width: `${stage.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join the Journey?</h3>
                        <p className="text-xl text-gray-600 mb-6">
                            Be part of transforming Busan into a global business hub. Your support helps us achieve each milestone 
                            and create lasting impact for international collaboration.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105">
                                Support the Project
                            </button>
                            <button className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-10 py-4 text-xl font-bold rounded-full transition-all duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Roadmap;