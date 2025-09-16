import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRoles } from '@/hooks/useRoles';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_TREE, hasRouteAccess, CONFIG } from '@/lib/config';
import { ChevronDown, ChevronRight, Menu, X, User, LogOut, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const PortalNavigation: React.FC = () => {
  const { userRole } = useRoles();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (path: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderNavItems = (items: any, level = 0) => {
    const currentRole = userRole || 'guest';
    
    return Object.entries(items).map(([path, config]: [string, any]) => {
      const hasAccess = hasRouteAccess(path, currentRole);
      
      // If SHOW_LOCKED_IN_MENU is false, hide inaccessible items (original behavior)
      if (!CONFIG.SHOW_LOCKED_IN_MENU && !hasAccess) return null;
      
      const hasChildren = config.children && Object.keys(config.children).length > 0;
      const isExpanded = expandedSections.has(path);
      const active = isActive(path);
      const isLocked = !hasAccess;
      
      const handleClick = (e: React.MouseEvent) => {
        if (isLocked) {
          e.preventDefault();
          window.location.href = `/auth?next=${encodeURIComponent(path)}`;
        } else {
          setMobileMenuOpen(false);
        }
      };
      
      return (
        <div key={path} className={cn("", level > 0 && "ml-4")}>
          <div
            className={cn(
              "flex items-center justify-between py-2 px-3 rounded-lg transition-colors group",
              active ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
              level === 0 && "font-medium",
              isLocked && "text-muted-foreground cursor-not-allowed"
            )}
          >
            {isLocked ? (
              <div 
                className="flex-1 flex items-center gap-2 cursor-not-allowed"
                onClick={handleClick}
              >
                <Lock className="w-3 h-3" />
                <span className={cn(
                  "text-sm",
                  level === 0 && "font-medium",
                  active && "font-semibold"
                )}>
                  {config.name}
                </span>
              </div>
            ) : (
              <Link
                to={path}
                className="flex-1 flex items-center gap-2"
                onClick={handleClick}
              >
                <span className={cn(
                  "text-sm",
                  level === 0 && "font-medium",
                  active && "font-semibold"
                )}>
                  {config.name}
                </span>
              </Link>
            )}
            
            {hasChildren && (
              <button
                onClick={() => toggleSection(path)}
                className={cn(
                  "p-1 hover:bg-muted rounded transition-colors",
                  isLocked && "cursor-not-allowed"
                )}
                disabled={isLocked}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          
          {hasChildren && isExpanded && !isLocked && (
            <div className="mt-1 space-y-1">
              {renderNavItems(config.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block w-64 bg-card border-r border-border h-screen overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg"></div>
            <span className="font-bold text-xl">ODE Portal</span>
          </Link>
          
          <div className="space-y-2">
            {renderNavItems(NAVIGATION_TREE['/'].children)}
          </div>
          
          {/* User Section */}
          {user && (
            <div className="mt-8 pt-4 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {userRole || 'guest'}
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-dark rounded"></div>
            <span className="font-bold">ODE Portal</span>
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[90vw] bg-card border-r border-border overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg"></div>
                    <span className="font-bold text-xl">ODE Portal</span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {renderNavItems(NAVIGATION_TREE['/'].children)}
                </div>
                
                {/* Mobile User Section */}
                {user && (
                  <div className="mt-8 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {userRole || 'guest'}
                        </div>
                      </div>
                      <button
                        onClick={signOut}
                        className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalNavigation;