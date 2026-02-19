'use client';

import { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Circle,
    ChevronRight,
    LayoutDashboard,
    Search,
    Filter,
    ArrowRight,
    TrendingUp,
    Clock,
    Unlock,
    Building2,
    User,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Task {
    id: string;
    text: string;
    completed: boolean;
    module: string;
    hints: string[];
}

interface Module {
    id: string;
    name: string;
    tasks: Task[];
}

export default function ManualTestDashboard() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPlan();
    }, []);

    const fetchPlan = async () => {
        try {
            const response = await fetch('/api/dev/get-test-plan');
            const data = await response.json();
            if (data.modules) {
                setModules(data.modules);
            }
        } catch (error) {
            console.error('Failed to fetch plan:', error);
            toast.error('Failed to load test plan');
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (taskId: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setModules(prev => prev.map(mod => ({
                ...mod,
                tasks: mod.tasks.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t)
            })));

            const response = await fetch('/api/dev/update-test-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId, completed: !currentStatus }),
            });

            if (!response.ok) throw new Error('Failed to update');

            toast.success(`${taskId} updated`);
        } catch (error) {
            toast.error('Failed to save changes');
            // Revert on error
            fetchPlan();
        }
    };

    const allTasks = modules.flatMap(m => m.tasks);
    const completedCount = allTasks.filter(t => t.completed).length;
    const totalCount = allTasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] pb-20">
            {/* Header Sticky section */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
                                <LayoutDashboard className="h-8 w-8 text-primary uppercase" />
                                Interactive Test Runner
                            </h1>
                            <p className="text-muted-foreground mt-1 font-medium">Matching: MANUAL_TEST_PLAN.md</p>
                        </div>

                        <div className="flex items-center gap-6 bg-muted/30 p-4 rounded-3xl border">
                            <div className="text-right">
                                <div className="text-sm font-bold">{completedCount} / {totalCount} Passed</div>
                                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter">{progress.toFixed(0)}% Production Ready</div>
                            </div>
                            <div className="w-14 h-14 relative flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle
                                        cx="18" cy="18" r="16"
                                        fill="none"
                                        className="stroke-gray-200 dark:stroke-gray-800"
                                        strokeWidth="3.5"
                                    />
                                    <circle
                                        cx="18" cy="18" r="16"
                                        fill="none"
                                        className="stroke-primary transition-all duration-700 ease-in-out"
                                        strokeWidth="3.5"
                                        strokeDasharray={`${progress}, 100`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-xs font-bold text-primary">
                                    {progress.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by ID or Task text..."
                                className="w-full bg-white dark:bg-zinc-900 border-border rounded-full pl-11 h-12 text-sm focus:ring-2 ring-primary transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="space-y-20">
                    {modules.map((module) => {
                        const filteredTasks = module.tasks.filter(t => {
                            const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
                            const matchesFilter = filter === 'all' || (filter === 'pending' && !t.completed) || (filter === 'done' && t.completed);
                            return matchesSearch && matchesFilter;
                        });

                        if (filteredTasks.length === 0 && (searchQuery || filter !== 'all')) return null;

                        return (
                            <section key={module.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="flex flex-col md:flex-row md:items-end gap-2 mb-10 border-b pb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-primary/20 mr-2">
                                        {module.id.split(' ').pop()}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-black tracking-tight">{module.name}</h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex -space-x-1">
                                                {module.tasks.map((t, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 w-4 rounded-full border border-white dark:border-black ${t.completed ? 'bg-primary' : 'bg-muted'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
                                                {module.tasks.filter(t => t.completed).length} / {module.tasks.length} Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {filteredTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`group relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${task.completed
                                                ? 'bg-primary/[0.03] border-primary/20 shadow-inner'
                                                : 'bg-white dark:bg-zinc-900 border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5'
                                                }`}
                                        >
                                            <div className="flex gap-8">
                                                <button
                                                    onClick={() => toggleTask(task.id, task.completed)}
                                                    className={`mt-1 shrink-0 h-10 w-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 transform active:scale-75 ${task.completed
                                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                                                        : 'border-muted-foreground/20 hover:border-primary group-hover:scale-110'
                                                        }`}
                                                >
                                                    {task.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6 text-muted-foreground/30" />}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${task.completed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                            {task.id}
                                                        </span>
                                                    </div>

                                                    <h3 className={`text-xl leading-snug mb-4 ${task.completed ? 'text-primary/90 font-black' : 'text-foreground font-bold'
                                                        }`}>
                                                        {task.text}
                                                    </h3>

                                                    {task.hints && task.hints.length > 0 && (
                                                        <div className={`mt-6 space-y-4 p-6 rounded-3xl ${task.completed ? 'bg-primary/5' : 'bg-muted/30'}`}>
                                                            {task.hints.map((hint, idx) => (
                                                                <div key={idx} className="flex gap-4 items-start">
                                                                    <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${task.completed ? 'bg-primary/40' : 'bg-primary/20'}`} />
                                                                    <p className={`text-sm leading-relaxed ${task.completed ? 'text-primary/70 font-medium' : 'text-muted-foreground font-medium'}`}>
                                                                        {hint.includes('Expected')
                                                                            ? <span className="not-italic font-black text-[10px] uppercase bg-primary/10 px-2 py-0.5 rounded text-primary mr-2 italic-none">Expected Outcome</span>
                                                                            : null
                                                                        }
                                                                        {hint.replace(/Expected:?\s*/i, '').replace(/Test Scenario:?\s*/i, '')}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="flex gap-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-3 rounded-full border shadow-2xl border-primary/20">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full px-6 transition-all ${filter === 'all' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                        onClick={() => setFilter('all')}
                    >All</Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full px-6 transition-all ${filter === 'pending' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                        onClick={() => setFilter('pending')}
                    >Pending</Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full px-6 transition-all ${filter === 'done' ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                        onClick={() => setFilter('done')}
                    >Completed</Button>
                </div>
            </div>
        </div>
    );
}
