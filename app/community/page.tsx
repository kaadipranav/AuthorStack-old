"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DimModeToggle } from "@/components/ui/dim-mode-toggle";
import { Logo } from "@/components/ui/logo";
import { CommunityLogo } from "@/components/ui/community-logo";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Users, MessageCircle, Heart, TrendingUp, Star, CheckCircle, Shield, BookOpen, Sparkles } from "lucide-react";
import { FeedList } from "@/components/community/FeedList";

export default function CommunityLandingPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Featured authors data
    const featuredAuthors = [
        { name: "Sarah Mitchell", genre: "Romance", books: 5, followers: "2.3K", avatar: "SM" },
        { name: "James Chen", genre: "Sci-Fi", books: 12, followers: "5.1K", avatar: "JC" },
        { name: "Emma Parker", genre: "Mystery", books: 3, followers: "1.8K", avatar: "EP" },
        { name: "David Kumar", genre: "Fantasy", books: 8, followers: "4.2K", avatar: "DK" },
        { name: "Lisa Anderson", genre: "Thriller", books: 6, followers: "3.5K", avatar: "LA" },
    ];

    return (
        <div className="min-h-screen">
            {/* Community-themed header with logo colors */}
            <header className="border-b border-stroke bg-surface/80 backdrop-blur sticky top-0 z-50">
                <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="transition-transform duration-300 hover:scale-105">
                            <Logo width={32} height={32} priority className="object-contain" />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-charcoal">
                            AuthorStack
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <DimModeToggle />
                        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                            <Link href="/auth/sign-in">Sign in</Link>
                        </Button>
                        <Button asChild size="sm" className="bg-burgundy hover:bg-burgundy/90">
                            <Link href="/auth/sign-up">Join Community</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section with Prominent Logo */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EB] to-[#FFE8D6] dim:from-charcoal dim:via-[#2a2a2a] dim:to-[#1a1a1a] py-20">
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="text-center mb-12">
                        {/* Prominent Logo Display */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-burgundy/20 to-amber/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                                <div className="relative bg-white/80 dim:bg-charcoal/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-burgundy/10 group-hover:border-burgundy/30 group-hover:scale-105 transition-all duration-300">
                                    <CommunityLogo width={300} height={100} priority className="object-contain" />
                                </div>
                            </div>
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink mb-6 leading-tight">
                            Connect with Fellow Authors
                        </h1>
                        <p className="text-xl md:text-2xl text-charcoal mb-8 max-w-3xl mx-auto leading-relaxed">
                            Share your journey, celebrate milestones, and grow together in a community built for indie authors.
                        </p>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
                            <div className="flex items-center gap-2 text-charcoal dim:text-surface bg-white/60 dim:bg-surface/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <CheckCircle className="h-5 w-5 text-green-600 dim:text-green-400" />
                                <span className="font-medium">Free forever</span>
                            </div>
                            <div className="flex items-center gap-2 text-charcoal dim:text-surface bg-white/60 dim:bg-surface/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <CheckCircle className="h-5 w-5 text-green-600 dim:text-green-400" />
                                <span className="font-medium">No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2 text-charcoal dim:text-surface bg-white/60 dim:bg-surface/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <Shield className="h-5 w-5 text-burgundy dim:text-amber" />
                                <span className="font-medium">Privacy-first platform</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 mb-10">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-burgundy mb-1">2,500+</div>
                                <div className="text-sm text-charcoal">Active Authors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-burgundy mb-1">15K+</div>
                                <div className="text-sm text-charcoal">Posts Shared</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-burgundy mb-1">50K+</div>
                                <div className="text-sm text-charcoal">Connections Made</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-burgundy hover:bg-burgundy/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                            >
                                <Link href="/auth/sign-up">
                                    Join the Community
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-2 border-burgundy/30 text-ink hover:bg-burgundy/5 hover:border-burgundy/50 px-8 py-6 text-lg transition-all duration-300"
                            >
                                <Link href="/auth/sign-in">Sign In</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid md:grid-cols-4 gap-6 mt-16">
                        <div className="bg-white/60 dim:bg-surface/40 backdrop-blur-sm rounded-xl p-6 text-center border border-burgundy/10 hover:border-burgundy/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-burgundy/10 dim:bg-burgundy/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-6 w-6 text-burgundy dim:text-amber" />
                            </div>
                            <h3 className="font-semibold text-ink mb-2">Author Profiles</h3>
                            <p className="text-sm text-charcoal">Showcase your books and connect with readers</p>
                        </div>
                        <div className="bg-white/60 dim:bg-surface/40 backdrop-blur-sm rounded-xl p-6 text-center border border-burgundy/10 hover:border-burgundy/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-burgundy/10 dim:bg-burgundy/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="h-6 w-6 text-burgundy dim:text-amber" />
                            </div>
                            <h3 className="font-semibold text-ink mb-2">Share Updates</h3>
                            <p className="text-sm text-charcoal">Post milestones and book launches</p>
                        </div>
                        <div className="bg-white/60 dim:bg-surface/40 backdrop-blur-sm rounded-xl p-6 text-center border border-burgundy/10 hover:border-burgundy/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-burgundy/10 dim:bg-burgundy/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-6 w-6 text-burgundy dim:text-amber" />
                            </div>
                            <h3 className="font-semibold text-ink mb-2">Engage</h3>
                            <p className="text-sm text-charcoal">Like, comment, and support fellow authors</p>
                        </div>
                        <div className="bg-white/60 dim:bg-surface/40 backdrop-blur-sm rounded-xl p-6 text-center border border-burgundy/10 hover:border-burgundy/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-burgundy/10 dim:bg-burgundy/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-6 w-6 text-burgundy dim:text-amber" />
                            </div>
                            <h3 className="font-semibold text-ink mb-2">Grow Together</h3>
                            <p className="text-sm text-charcoal">Learn from successful indie authors</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-paper">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-burgundy/10 dim:bg-burgundy/20 text-burgundy dim:text-amber px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="h-4 w-4" />
                            <span>Simple & Effective</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                            Start Connecting in 3 Simple Steps
                        </h2>
                        <p className="text-lg text-charcoal">
                            Join thousands of authors building their audience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-burgundy dim:bg-amber text-white dim:text-charcoal rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                1
                            </div>
                            <h3 className="font-semibold text-xl mb-3 text-ink">Create Your Profile</h3>
                            <p className="text-charcoal leading-relaxed">
                                Showcase your books and author brand in minutes. Add your bio, social links, and published works.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-burgundy dim:bg-amber text-white dim:text-charcoal rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                2
                            </div>
                            <h3 className="font-semibold text-xl mb-3 text-ink">Share Your Journey</h3>
                            <p className="text-charcoal leading-relaxed">
                                Post updates, milestones, and book launches. Engage with your readers and fellow authors.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-burgundy dim:bg-amber text-white dim:text-charcoal rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                3
                            </div>
                            <h3 className="font-semibold text-xl mb-3 text-ink">Grow Together</h3>
                            <p className="text-charcoal leading-relaxed">
                                Connect with readers, collaborate with authors, and build your platform organically.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Button asChild size="lg" className="bg-burgundy hover:bg-burgundy/90 hover:scale-105 transition-all duration-300">
                            <Link href="/auth/sign-up">Get Started Free</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Authors Section */}
            <section className="py-16 bg-gradient-to-br from-burgundy/5 to-amber/5 dim:from-charcoal/50 dim:to-[#1a1a1a]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                            Meet Our Community
                        </h2>
                        <p className="text-lg text-charcoal">
                            Successful indie authors sharing their stories
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        {featuredAuthors.map((author, index) => (
                            <Card key={index} className="border-2 border-stroke hover:border-burgundy/30 dim:hover:border-amber/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-burgundy/20 to-amber/20 dim:from-burgundy/30 dim:to-amber/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-2xl font-serif text-burgundy dim:text-amber font-bold">{author.avatar}</span>
                                    </div>
                                    <div className="font-semibold text-ink mb-1">{author.name}</div>
                                    <div className="text-sm text-charcoal mb-3">{author.genre}</div>
                                    <div className="flex justify-center gap-4 text-xs mb-3">
                                        <div>
                                            <div className="font-bold text-burgundy dim:text-amber">{author.books}</div>
                                            <div className="text-charcoal">Books</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-burgundy dim:text-amber">{author.followers}</div>
                                            <div className="text-charcoal">Followers</div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full text-xs">
                                        View Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-surface">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                            Loved by Indie Authors Worldwide
                        </h2>
                        <p className="text-lg text-charcoal">
                            See what authors are saying about our community
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <Card className="border-2 border-stroke hover:border-burgundy/30 dim:hover:border-amber/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-burgundy/10 dim:bg-burgundy/20 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-serif text-burgundy dim:text-amber">SM</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-ink">Sarah Mitchell</div>
                                        <div className="text-sm text-charcoal">5 books published</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-charcoal italic leading-relaxed">
                                    "AuthorStack Community has been a game-changer for connecting with my readers. I've grown my following by 300% in just 3 months!"
                                </p>
                            </CardContent>
                        </Card>

                        {/* Testimonial 2 */}
                        <Card className="border-2 border-stroke hover:border-burgundy/30 dim:hover:border-amber/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-burgundy/10 dim:bg-burgundy/20 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-serif text-burgundy dim:text-amber">JC</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-ink">James Chen</div>
                                        <div className="text-sm text-charcoal">12 books published</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-charcoal italic leading-relaxed">
                                    "The support from fellow authors here is incredible. I've found beta readers, collaborators, and lifelong friends."
                                </p>
                            </CardContent>
                        </Card>

                        {/* Testimonial 3 */}
                        <Card className="border-2 border-stroke hover:border-burgundy/30 dim:hover:border-amber/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-burgundy/10 dim:bg-burgundy/20 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-serif text-burgundy dim:text-amber">EP</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-ink">Emma Parker</div>
                                        <div className="text-sm text-charcoal">3 books published</div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-charcoal italic leading-relaxed">
                                    "As a new author, this community gave me the confidence to share my work. The feedback and encouragement are invaluable."
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Public Feed Section */}
            <section className="py-16 bg-paper">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="mb-8 text-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                            Latest from the Community
                        </h2>
                        <p className="text-lg text-charcoal">
                            See what authors are sharing. Sign in to join the conversation.
                        </p>
                    </div>

                    {/* Public Feed - Read Only */}
                    {isClient && (
                        <div className="relative">
                            {/* Overlay for non-authenticated users */}
                            <div className="pointer-events-none">
                                <FeedList feedType="global" />
                            </div>

                            {/* Login prompt overlay on interaction */}
                            <div className="mt-8 text-center bg-surface/80 backdrop-blur-sm border-2 border-burgundy/20 rounded-xl p-8">
                                <h3 className="font-serif text-2xl text-ink mb-3">
                                    Join the Conversation
                                </h3>
                                <p className="text-charcoal mb-6">
                                    Sign in to like, comment, and share your own author journey
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button asChild size="lg" className="bg-burgundy hover:bg-burgundy/90">
                                        <Link href="/auth/sign-up">Create Account</Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/auth/sign-in">Sign In</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-surface">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-charcoal">
                            Everything you need to know about AuthorStack Community
                        </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="free">
                            <AccordionTrigger className="text-left font-semibold text-ink hover:text-burgundy dim:hover:text-amber">
                                Is AuthorStack Community really free?
                            </AccordionTrigger>
                            <AccordionContent className="text-charcoal leading-relaxed">
                                Yes! AuthorStack Community is 100% free to use. You can create your profile, share posts, connect with other authors, and engage with the community without any cost. Our free tier includes access to 2 platform integrations.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="privacy">
                            <AccordionTrigger className="text-left font-semibold text-ink hover:text-burgundy dim:hover:text-amber">
                                How do you protect my privacy?
                            </AccordionTrigger>
                            <AccordionContent className="text-charcoal leading-relaxed">
                                We take privacy seriously. You control your profile visibility (public, followers-only, or private). We never sell your data, and you can delete your account at any time. All data is encrypted and stored securely.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="who">
                            <AccordionTrigger className="text-left font-semibold text-ink hover:text-burgundy dim:hover:text-amber">
                                Who can join the community?
                            </AccordionTrigger>
                            <AccordionContent className="text-charcoal leading-relaxed">
                                Any indie author, aspiring writer, or book enthusiast can join! Whether you've published 10 books or you're working on your first draft, you're welcome here. Our community is supportive and inclusive.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="features">
                            <AccordionTrigger className="text-left font-semibold text-ink hover:text-burgundy dim:hover:text-amber">
                                What features are included?
                            </AccordionTrigger>
                            <AccordionContent className="text-charcoal leading-relaxed">
                                You get a customizable author profile, ability to post updates and milestones, like and comment on posts, follow other authors, showcase your books, and connect with readers. Plus, access to our full dashboard for tracking sales and managing your author business.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="support">
                            <AccordionTrigger className="text-left font-semibold text-ink hover:text-burgundy dim:hover:text-amber">
                                How do I get help if I need it?
                            </AccordionTrigger>
                            <AccordionContent className="text-charcoal leading-relaxed">
                                We offer email support, comprehensive documentation, and an active community forum. Premium users get priority support and access to live chat. You can reach us anytime at support@authorstack.com.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 bg-gradient-to-br from-burgundy/10 to-amber/10 dim:from-charcoal/50 dim:to-[#1a1a1a]">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                        Ready to Join 2,500+ Authors?
                    </h2>
                    <p className="text-lg text-charcoal mb-8 max-w-2xl mx-auto">
                        Start building your author platform today. Connect with readers, share your journey, and grow your audience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-burgundy hover:bg-burgundy/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            <Link href="/auth/sign-up">
                                Start Free Today
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-2 border-burgundy/30 text-ink hover:bg-burgundy/5 px-8 py-6 text-lg transition-all duration-300"
                        >
                            <Link href="/auth/sign-in">Sign In</Link>
                        </Button>
                    </div>
                    <p className="text-sm text-charcoal mt-6">
                        No credit card required • Free forever • Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-stroke bg-surface py-8">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Logo width={24} height={24} className="object-contain" />
                            <span className="text-sm text-charcoal">
                                © 2025 AuthorStack. Built for indie authors.
                            </span>
                        </div>
                        <div className="flex gap-6">
                            <Link href="/" className="text-sm text-charcoal hover:text-burgundy transition-colors">
                                Home
                            </Link>
                            <Link href="/dashboard" className="text-sm text-charcoal hover:text-burgundy transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/community" className="text-sm text-charcoal hover:text-burgundy transition-colors">
                                Community
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
