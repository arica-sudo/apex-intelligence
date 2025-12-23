'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, AlertTriangle, ArrowRight, Activity } from 'lucide-react';

export default function AiInsight({ scanId, initialData }: { scanId: string, initialData?: any }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scanId })
            });
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!data && !loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 text-center relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-apex-primary/10 to-apex-accent/10 opacity-0 group-hover:opacity-100 transition duration-500" />
                <Bot className="w-12 h-12 text-apex-primary mx-auto mb-4 relative z-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">Unlock AI Strategy</h3>
                <p className="text-white/60 mb-6 bg-clip-text relative z-10">Generate a comprehensive gap analysis and strategic roadmap using our Neural Engine.</p>
                <button onClick={generate} className="relative z-10 bg-gradient-to-r from-apex-primary to-apex-accent px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:scale-105 transition shadow-lg shadow-apex-primary/25">
                    <Sparkles className="w-5 h-5" /> Generate Intelligence Report
                </button>
            </motion.div>
        )
    }

    if (loading) {
        return (
            <div className="glass-panel p-12 text-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-t-2 border-b-2 border-apex-primary animate-spin" />
                </div>
                <Bot className="w-12 h-12 text-apex-primary mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold animate-pulse">Neural Engine Processing...</h3>
                <p className="text-white/50">Analyzing competitive landscape and identifying gaps.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 border-l-4 border-apex-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bot className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Bot className="w-6 h-6 text-apex-primary" />
                    <h3 className="text-xl font-bold">Strategic Synthesis</h3>
                </div>
                <p className="text-lg text-white/90 leading-relaxed relative z-10">{data.summary}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-6 h-6 text-apex-crimson" />
                        <h3 className="text-xl font-bold">Critical Gaps</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.gaps.map((gap: string, i: number) => (
                            <li key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-lg border border-white/5">
                                <span className="bg-apex-crimson/20 text-apex-crimson text-xs font-bold px-2 py-1 rounded mt-0.5">{i + 1}</span>
                                <span className="text-white/90 text-sm">{gap}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-6 h-6 text-apex-emerald" />
                        <h3 className="text-xl font-bold">Bridge Roadmap</h3>
                    </div>
                    <div className="space-y-6">
                        {data.bridge_roadmap.map((phase: any, i: number) => (
                            <div key={i} className="relative pl-6 border-l-2 border-white/10">
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-apex-cyan" />
                                <h4 className="font-bold text-apex-cyan mb-2 text-lg">{phase.phase}</h4>
                                <ul className="space-y-2">
                                    {phase.actions.map((action: string, j: number) => (
                                        <li key={j} className="flex items-center gap-2 text-white/70 text-sm">
                                            <ArrowRight className="w-3 h-3 text-white/30" />
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
