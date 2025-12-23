import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ResultCards from '@/components/ui/result-cards';
import TrafficAnalysis from '@/components/ui/traffic-analysis';
import BacklinkAnalysis from '@/components/ui/backlink-analysis';
import KeywordAnalysis from '@/components/ui/keyword-analysis';
import AiInsight from '@/components/ui/ai-insight';

// Dynamically import heavy 3D components
const ParticleBackground = dynamic(() => import('@/components/ui/particle-background'), { ssr: false });
const CompetitiveUniverse = dynamic(() => import('@/components/ui/competitive-universe'), { ssr: false });

export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session) redirect('/auth/signin');

    const scan = await prisma.scan.findUnique({ where: { id: params.id } });

    if (!scan) notFound();

    // Reconstruct result object
    const result = {
        url: scan.url,
        domain: scan.domain,
        timestamp: scan.timestamp.getTime(),
        techStack: JSON.parse(scan.techStack),
        performance: JSON.parse(scan.performance),
        seoHealth: JSON.parse(scan.seoHealth),
        backlinks: scan.backlinks ? JSON.parse(scan.backlinks) : null,
        keywords: scan.keywords ? JSON.parse(scan.keywords) : null,
        traffic: scan.traffic ? JSON.parse(scan.traffic) : null,
        competitors: scan.competitors ? JSON.parse(scan.competitors) : null,
        status: 'completed' as const,
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-apex-light to-apex-lighter dark:from-apex-dark dark:to-apex-darker transition-all duration-300">
            {/* WebGL Particle Background */}
            <ParticleBackground />

            {/* Animated mesh background */}
            <div className="fixed inset-0 mesh-background opacity-30 dark:opacity-30 opacity-10 pointer-events-none" />

            {/* Navigation */}
            <div className="relative z-50 p-6 flex justify-between items-center">
                <Link href="/dashboard" className="glass-panel px-4 py-2 hover:bg-white/10 transition flex items-center gap-2 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Mission Control
                </Link>
            </div>

            <div className="relative z-10 container mx-auto px-6 pb-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gradient-premium mb-2">
                        Intelligence Report Retrieval
                    </h1>
                    <p className="text-white/50 text-sm">Target ID: {scan.id}</p>
                </div>

                {/* Phase 1 Results */}
                <ResultCards result={result} />

                {/* Phase 2: Advanced Analytics */}
                <div className="mt-6 space-y-6">
                    {/* 3D Competitive Universe */}
                    {result.backlinks && (
                        <CompetitiveUniverse
                            yourDomain={result.domain}
                            competitors={result.competitors}
                        />
                    )}

                    {/* Traffic Analysis */}
                    {result.traffic && (
                        <TrafficAnalysis data={result.traffic} />
                    )}

                    {/* Backlink Profile */}
                    {result.backlinks && (
                        <BacklinkAnalysis data={result.backlinks} />
                    )}

                    {/* Keyword Rankings */}
                    {result.keywords && (
                        <KeywordAnalysis data={result.keywords} />
                    )}

                    {/* AI Analysis (Phase 4) */}
                    <AiInsight scanId={scan.id} initialData={scan.aiAnalysis ? JSON.parse(scan.aiAnalysis) : null} />
                </div>
            </div>

            <footer className="relative z-10 text-center py-8 text-foreground/40 text-sm">
                <p>Apex Intelligence v0.3 | Historical Archive</p>
            </footer>
        </main>
    );
}
