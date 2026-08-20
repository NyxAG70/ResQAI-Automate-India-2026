import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Dashboard from '@/pages/dashboard';
import Report from '@/pages/report';
import Analysis from '@/pages/analysis';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
  Link
} from 'wouter';
import { AlertCircle, Activity, LayoutDashboard, PlusSquare, ShieldAlert, ScanSearch, Menu, X } from 'lucide-react';

const queryClient = new QueryClient();

function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return <>{children}</>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    window.setTimeout(() => menuTriggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const focusTimer = window.setTimeout(
      () => closeButtonRef.current?.focus(),
      0,
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={drawerRef}
        id="mobile-navigation"
        role={mobileMenuOpen ? 'dialog' : undefined}
        aria-modal={mobileMenuOpen || undefined}
        aria-label={mobileMenuOpen ? 'Mobile navigation' : undefined}
        className={`fixed inset-y-0 left-0 md:static md:h-full w-64 flex-col overflow-y-auto border-r border-border bg-sidebar z-40 ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}
      >
        <div className="h-16 shrink-0 flex items-center justify-between md:justify-start px-4 border-b border-border bg-sidebar-accent/30">
          <div className="flex items-center">
            <ShieldAlert className="w-8 h-8 text-sidebar-primary" />
            <span className="ml-3 font-mono-ui font-bold text-lg tracking-wider text-sidebar-foreground">RESQAI_CMD</span>
          </div>
          <button
            type="button"
            ref={closeButtonRef}
            aria-label="Close navigation"
            className="md:hidden text-sidebar-foreground"
            onClick={closeMobileMenu}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 min-h-0 overflow-y-auto py-4 flex flex-col gap-2 px-2">
          <Link href="/">
              <div onClick={closeMobileMenu} className={`flex items-center px-4 py-3 rounded-md cursor-pointer transition-colors ${location === '/' ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}>
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span className="ml-3 font-medium text-sm">Command Center</span>
            </div>
          </Link>
          <Link href="/report">
              <div onClick={closeMobileMenu} className={`flex items-center px-4 py-3 rounded-md cursor-pointer transition-colors ${location === '/report' ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}>
              <PlusSquare className="w-5 h-5 shrink-0" />
              <span className="ml-3 font-medium text-sm">Submit Report</span>
            </div>
          </Link>
          <Link href="/analysis">
              <div onClick={closeMobileMenu} className={`flex items-center px-4 py-3 rounded-md cursor-pointer transition-colors ${location === '/analysis' ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}>
              <ScanSearch className="w-5 h-5 shrink-0" />
              <span className="ml-3 font-medium text-sm">AI Image Analysis</span>
            </div>
          </Link>
        </nav>
        <div className="p-4 shrink-0 border-t border-border flex items-center bg-sidebar-accent/10">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          <span className="text-xs font-mono-ui text-sidebar-foreground/70">SYSTEM_ONLINE</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background grid-pattern">
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-md z-10 shadow-sm shrink-0">
          <div className="flex items-center">
            <button
              type="button"
              ref={menuTriggerRef}
              aria-controls="mobile-navigation"
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation"
              className="md:hidden mr-4 text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center text-sm font-mono-ui text-muted-foreground">
              <span>[SYS] {new Date().toISOString().split('T')[0]}</span>
              <span className="mx-2">|</span>
              <span className="text-primary flex items-center"><Activity className="w-4 h-4 mr-1" /> UPLINK_ACTIVE</span>
            </div>
            <div className="sm:hidden flex items-center text-sm font-mono-ui text-primary">
              <Activity className="w-4 h-4 mr-1" /> UPLINK
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] sm:text-xs font-mono-ui border border-destructive text-destructive px-2 py-1 rounded-sm flex items-center bg-destructive/10">
              <AlertCircle className="w-3 h-3 mr-1" />
              AUTHORITY_MODE
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 z-0">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Shell>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/report" component={Report} />
          <Route path="/analysis" component={Analysis} />
          <Route component={NotFound} />
        </Switch>
      </Shell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
