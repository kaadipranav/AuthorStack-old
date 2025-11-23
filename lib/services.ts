import { SupabaseUserRepository } from "./modules/user/infrastructure/supabase-repository";
import { UserService } from "./modules/user/application/user-service";
import { SupabaseBookRepository, SupabaseSalesRepository } from "./modules/book/infrastructure/supabase-repository";
import { BookService, SalesService } from "./modules/book/application/book-service";
import { MockAgentRepository } from "./modules/agent/infrastructure/mock-repository";
import { AgentService } from "./modules/agent/application/agent-service";
import { MockCommunityRepository } from "./modules/community/infrastructure/mock-repository";
import { CommunityService } from "./modules/community/application/community-service";
import { SupabaseLaunchRepository } from "./modules/launch/infrastructure/supabase-repository";
import { LaunchService } from "./modules/launch/application/launch-service";
import { SupabaseCompetitorRepository } from "./modules/competitor/infrastructure/supabase-repository";
import { CompetitorService } from "./modules/competitor/application/competitor-service";
import { SupabaseInsightsRepository } from "./modules/insights/infrastructure/supabase-repository";
import { InsightsService } from "./modules/insights/application/insights-service";
import { AnalyticsService, FunnelService, PricingService } from "./modules/analytics/application/analytics-service";

// Singleton instances (lazy initialization could be better but this is simple for now)
const userRepository = new SupabaseUserRepository();
const userService = new UserService(userRepository);

const bookRepository = new SupabaseBookRepository();
const salesRepository = new SupabaseSalesRepository();
const bookService = new BookService(bookRepository);
const salesService = new SalesService(salesRepository);

const agentRepository = new MockAgentRepository();
const agentService = new AgentService(agentRepository);

const communityRepository = new MockCommunityRepository();
const communityService = new CommunityService(communityRepository);

const launchRepository = new SupabaseLaunchRepository();
const launchService = new LaunchService(launchRepository);

const competitorRepository = new SupabaseCompetitorRepository();
const competitorService = new CompetitorService(competitorRepository);

const insightsRepository = new SupabaseInsightsRepository();
const insightsService = new InsightsService(insightsRepository);

const analyticsService = new AnalyticsService();
const funnelService = new FunnelService();
const pricingService = new PricingService();

export const services = {
    user: userService,
    book: bookService,
    sales: salesService,
    agent: agentService,
    community: communityService,
    launch: launchService,
    competitor: competitorService,
    insights: insightsService,
    analytics: analyticsService,
    funnel: funnelService,
    pricing: pricingService,
};
