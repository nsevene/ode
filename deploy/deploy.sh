#!/bin/bash

# ODE Food Hall Deployment Script for ISPmanager
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="ode-food-hall"
DOMAIN="odefoodhall.com"
SERVER_PATH="/var/www/$DOMAIN"
BACKUP_PATH="/backup/$PROJECT_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root"
fi

# Check if required tools are installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi
    
    if ! command -v git &> /dev/null; then
        error "git is not installed"
    fi
    
    log "All dependencies are available"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    if [ -d "$SERVER_PATH" ]; then
        BACKUP_FILE="$BACKUP_PATH/backup_$(date +%Y%m%d_%H%M%S).tar.gz"
        mkdir -p "$BACKUP_PATH"
        
        tar -czf "$BACKUP_FILE" -C "$SERVER_PATH" .
        log "Backup created: $BACKUP_FILE"
    else
        warning "No existing installation found, skipping backup"
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$SERVER_PATH"
    npm ci --production=false
    log "Dependencies installed"
}

# Build project
build_project() {
    log "Building project for $ENVIRONMENT..."
    
    cd "$SERVER_PATH"
    
    # Set environment variables
    export NODE_ENV=$ENVIRONMENT
    
    # Build the project
    npm run build
    
    if [ ! -d "dist" ]; then
        error "Build failed - dist directory not found"
    fi
    
    log "Project built successfully"
}

# Deploy files
deploy_files() {
    log "Deploying files..."
    
    cd "$SERVER_PATH"
    
    # Copy built files to public_html
    if [ -d "public_html" ]; then
        rm -rf public_html/*
    else
        mkdir -p public_html
    fi
    
    cp -r dist/* public_html/
    
    # Set proper permissions
    chmod -R 755 public_html/
    chmod -R 644 public_html/*
    
    log "Files deployed successfully"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."
    
    cd "$SERVER_PATH"
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
VITE_SUPABASE_URL=https://ejwjrsgkxxrwlyfohdat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RESEND_API_KEY=re_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
NODE_ENV=$ENVIRONMENT
EOF
        warning "Please update .env file with your actual API keys"
    fi
    
    log "Environment configured"
}

# Setup SSL
setup_ssl() {
    log "Setting up SSL..."
    
    # This would typically be done through ISPmanager interface
    # or using certbot for Let's Encrypt
    warning "Please configure SSL certificate through ISPmanager interface"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create log directory
    mkdir -p /var/log/$PROJECT_NAME
    
    # Create monitoring script
    cat > /usr/local/bin/monitor-$PROJECT_NAME.sh << 'EOF'
#!/bin/bash
# Monitor ODE Food Hall application

LOG_FILE="/var/log/ode-food-hall/monitor.log"
DOMAIN="odefoodhall.com"

# Check if site is accessible
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    echo "$(date): Site is accessible" >> $LOG_FILE
else
    echo "$(date): Site is not accessible" >> $LOG_FILE
    # Send notification (implement your notification method)
fi
EOF
    
    chmod +x /usr/local/bin/monitor-$PROJECT_NAME.sh
    
    # Add to crontab (check every 5 minutes)
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-$PROJECT_NAME.sh") | crontab -
    
    log "Monitoring setup completed"
}

# Cleanup old backups
cleanup_backups() {
    log "Cleaning up old backups..."
    
    # Keep only last 10 backups
    cd "$BACKUP_PATH"
    ls -t | tail -n +11 | xargs -r rm -rf
    
    log "Old backups cleaned up"
}

# Main deployment function
deploy() {
    log "Starting deployment of $PROJECT_NAME to $ENVIRONMENT environment"
    
    check_dependencies
    create_backup
    install_dependencies
    build_project
    deploy_files
    setup_environment
    setup_ssl
    setup_monitoring
    cleanup_backups
    
    log "Deployment completed successfully!"
    log "Site should be available at: https://$DOMAIN"
    
    # Final checks
    log "Running final checks..."
    
    # Check if site is accessible
    if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
        log "✅ Site is accessible"
    else
        warning "⚠️  Site might not be accessible yet (SSL setup may be pending)"
    fi
    
    log "Deployment process completed!"
}

# Rollback function
rollback() {
    log "Rolling back to previous version..."
    
    if [ -d "$BACKUP_PATH" ]; then
        LATEST_BACKUP=$(ls -t "$BACKUP_PATH" | head -n1)
        if [ -n "$LATEST_BACKUP" ]; then
            cd "$SERVER_PATH"
            rm -rf public_html/*
            tar -xzf "$BACKUP_PATH/$LATEST_BACKUP" -C public_html/
            log "Rollback completed to: $LATEST_BACKUP"
        else
            error "No backup found for rollback"
        fi
    else
        error "No backup directory found"
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [environment] [action]"
    echo ""
    echo "Environments:"
    echo "  production  - Deploy to production (default)"
    echo "  staging     - Deploy to staging"
    echo ""
    echo "Actions:"
    echo "  deploy      - Deploy the application (default)"
    echo "  rollback    - Rollback to previous version"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy to production"
    echo "  $0 staging           # Deploy to staging"
    echo "  $0 production rollback # Rollback production"
}

# Main script logic
case "${2:-deploy}" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
        ;;
    *)
        usage
        exit 1
        ;;
esac
