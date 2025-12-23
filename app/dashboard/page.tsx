import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BarChart2, Globe, Clock, Shield, Zap } from 'lucide-react';

export default async function Dashboard() {
    const session = await auth();
    if (!session) redirect('/auth/signin');

    const scans = await prisma.scan.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: 'desc' }
    });

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-apex-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-apex-accent/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-apex-cyan to-apex-violet">Mission Control</h1>
                        <p className="text-white/50 text-sm mt-1">Welcome back, Agent {session.user.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/" className="glass-panel px-6 py-2 hover:bg-white/10 transition flex items-center gap-2">
                            <Zap className="w-4 h-4 text-apex-cyan" />
                            Execute New Scan
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-4">
                    {scans.map((scan) => {
                        const perf = JSON.parse(scan.performance);
                        const seo = JSON.parse(scan.seoHealth);
                        const tech = JSON.parse(scan.techStack);

                        return (
                            <div key={scan.id} className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition border-l-4 border-l-transparent hover:border-l-apex-cyan">
                                <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                    <div className="p-3 bg-white/5 rounded-full">
                                        <Globe className="w-6 h-6 text-apex-cyan" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white group-hover:text-apex-cyan transition">{scan.domain}</h2>
                                        <div className="flex items-center gap-3 text-sm text-white/50 mt-1">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(scan.timestamp).toLocaleDateString()}</span>
                                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{tech.framework || 'Unknown Framework'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-center min-w-[80px]">
                                        <span className="text-xs text-white/50 block mb-1 flex justify-center items-center gap-1"><Zap className="w-3 h-3" /> Perf</span>
                                        <div className="relative inline-block">
                                            <svg className="w-12 h-12 transform -rotate-90">
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                                    className={perf.score >= 90 ? 'text-apex-emerald' : perf.score >= 50 ? 'text-yellow-400' : 'text-apex-crimson'}
                                                    strokeDasharray={125.6}
                                                    strokeDashoffset={125.6 - (125.6 * perf.score) / 100}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{perf.score}</span>
                                        </div>
                                    </div>

                                    <div className="text-center min-w-[80px]">
                                        <span className="text-xs text-white/50 block mb-1 flex justify-center items-center gap-1"><Shield className="w-3 h-3" /> SEO</span>
                                        <div className="relative inline-block">
                                            <svg className="w-12 h-12 transform -rotate-90">
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                                    className={seo.score >= 90 ? 'text-apex-emerald' : seo.score >= 50 ? 'text-yellow-400' : 'text-apex-crimson'}
                                                    strokeDasharray={125.6}
                                                    strokeDashoffset={125.6 - (125.6 * seo.score) / 100}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{seo.score}</span>
                                        </div>
                                    </div>

                                    <Link href={`/report/${scan.id}`} className="p-3 rounded-full bg-white/5 hover:bg-apex-primary hover:text-white transition group-hover:translate-x-1">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    {scans.length === 0 && (
                        <div className="text-center py-20 px-4 glass-panel border-dashed border-white/20">
                            <BarChart2 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                            <h3 className="text-xl font-semibold mb-2">No Intelligence Reports</h3>
                            <p className="text-white/50 mb-6 max-w-md mx-auto">Your database is empty. Initiate your first target scan to populate the mission control center.</p>
                            <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-apex-primary to-apex-accent px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                                <Zap className="w-4 h-4" /> Start Scan
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
