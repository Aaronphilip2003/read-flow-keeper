import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const DummyBook = ({ title, author, cover, index }: { title: string; author: string; cover: string; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="relative group"
    >
        <div className="relative h-[320px] w-[220px] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
            <img
                src={cover}
                alt={title}
                className="h-full w-full object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="font-semibold text-lg leading-tight">{title}</h4>
                    <p className="text-sm text-gray-200">{author}</p>
                </div>
            </div>
        </div>
    </motion.div>
);

const dummyBooks = [
    {
        title: "The Midnight Library",
        author: "Matt Haig",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
    },
    {
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400"
    }
];

const stats = [
    { number: "10k+", label: "Active Readers" },
    { number: "500k+", label: "Books Tracked" },
    { number: "2M+", label: "Reading Sessions" },
    { number: "100k+", label: "Notes & Quotes" },
];

const testimonials = [
    {
        quote: "ReadFlow helped me achieve my goal of reading 52 books in a year. The tracking and insights are invaluable!",
        author: "Sarah M.",
        role: "Book Club Leader"
    },
    {
        quote: "I love how easy it is to capture and organize quotes from my books. It's become an essential part of my reading routine.",
        author: "James K.",
        role: "Literature Student"
    },
    {
        quote: "The reading statistics motivate me to read more consistently. I can clearly see my progress over time.",
        author: "Michael R.",
        role: "Avid Reader"
    }
];

const faqs = [
    {
        question: "How does ReadFlow help me read more?",
        answer: "ReadFlow helps you build consistent reading habits by tracking your reading sessions, setting goals, and providing visual progress indicators. You can see your daily, weekly, and monthly reading patterns, helping you stay motivated and accountable."
    },
    {
        question: "Can I export my notes and quotes?",
        answer: "Yes! ReadFlow allows you to export all your notes, quotes, and reading statistics in various formats. You can easily share your insights or keep them for future reference."
    },
    {
        question: "Is there a mobile app available?",
        answer: "ReadFlow is currently available as a web application that works great on both desktop and mobile browsers. We're working on dedicated mobile apps to make your reading tracking even more convenient."
    },
    {
        question: "How secure is my reading data?",
        answer: "We take data security seriously. All your reading data is stored securely in the cloud, protected by industry-standard encryption, and you have full control over your privacy settings."
    }
];

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100/50"
    >
        <div className="h-12 w-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="inline-block">
                                <span className="bg-amber-100/50 text-amber-900 px-4 py-2 rounded-full text-sm font-medium">
                                    Now Available
                                </span>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                                    Transform Your
                                </h1>
                                <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                                    <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                                        Reading Journey
                                    </span>
                                </h1>
                            </div>
                            <div className="space-y-6 max-w-xl">
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    ReadFlow helps you build lasting reading habits through intelligent tracking and powerful analytics. Discover insights about your reading patterns and achieve your reading goals.
                                </p>
                                <div className="flex flex-wrap gap-4 items-center pt-4">
                                    <Link to="/register">
                                        <Button size="lg" className="text-lg px-8 py-6 bg-amber-800 hover:bg-amber-900 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link to="/login">
                                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-amber-900 border-amber-200 hover:bg-amber-50 transition-all duration-300">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="flex justify-center gap-6 md:gap-8 pr-4">
                                {dummyBooks.map((book, index) => (
                                    <div
                                        key={book.title}
                                        className={`transform ${index === 1 ? 'translate-y-12' : ''}`}
                                        style={{
                                            perspective: '1000px',
                                            transform: `rotateY(${index * 5}deg) translateZ(${index * 10}px)`
                                        }}
                                    >
                                        <DummyBook {...book} index={index} />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={stat.label}
                                className="space-y-2"
                            >
                                <div className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        Everything You Need to Read More
                    </motion.h2>
                    <p className="text-xl text-gray-600">
                        Powerful features designed to enhance your reading experience and help you achieve your goals.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<svg className="h-6 w-6 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>}
                        title="Smart Progress Tracking"
                        description="Automatically track your reading sessions, analyze your habits, and get personalized recommendations to improve your reading routine."
                    />
                    <FeatureCard
                        icon={<svg className="h-6 w-6 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>}
                        title="Intelligent Note-Taking"
                        description="Capture and organize your thoughts with our advanced note-taking system. Tag, categorize, and search through your reading insights effortlessly."
                    />
                    <FeatureCard
                        icon={<svg className="h-6 w-6 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>}
                        title="Goal Achievement System"
                        description="Set and track personalized reading goals with our intuitive dashboard. Visualize your progress and celebrate your milestones."
                    />
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-gradient-to-b from-amber-50/30 to-transparent py-24">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
                    >
                        Loved by Readers Worldwide
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                key={index}
                                className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="h-10 w-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                                        <span className="text-amber-800 font-semibold">{testimonial.author[0]}</span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-semibold text-gray-900">{testimonial.author}</div>
                                        <div className="text-gray-500 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{testimonial.quote}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
                        Common Questions
                    </h2>
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden"
                            >
                                <AccordionTrigger className="px-6 hover:no-underline">
                                    <span className="text-left font-medium text-gray-900">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 text-gray-600">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Start Your Reading Journey
                        </h2>
                        <p className="text-xl text-amber-100 mb-8">
                            Join thousands of readers who are tracking their progress and achieving their reading goals with ReadFlow.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-amber-900 hover:bg-amber-50 shadow-lg hover:shadow-xl transition-all duration-300">
                                    Sign Up Now
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10 transition-all duration-300">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
                .text-gradient {
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                }
                
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, #000 1px, transparent 1px),
                                    linear-gradient(to bottom, #000 1px, transparent 1px);
                    background-size: 24px 24px;
                }
            `}</style>
        </div>
    );
};

export default Home; 