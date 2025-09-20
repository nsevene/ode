// =====================================================
// PERFORMANCE MONITORING FOR ODPORTAL B2B
// =====================================================

export interface PerformanceMetric {
  id: string
  name: string
  value: number
  unit: string
  timestamp: string
  category: 'api' | 'database' | 'ui' | 'network' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  metadata?: Record<string, any>
}

export interface PerformanceAlert {
  id: string
  metric: string
  threshold: number
  currentValue: number
  severity: 'warning' | 'error' | 'critical'
  message: string
  timestamp: string
  resolved: boolean
}

export interface PerformanceReport {
  period: string
  totalRequests: number
  averageResponseTime: number
  errorRate: number
  slowestEndpoints: Array<{
    endpoint: string
    averageTime: number
    requestCount: number
  }>
  topErrors: Array<{
    error: string
    count: number
    percentage: number
  }>
  recommendations: string[]
}

// =====================================================
// PERFORMANCE MONITOR CLASS
// =====================================================

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private alerts: PerformanceAlert[] = []
  private observers: Array<(metric: PerformanceMetric) => void> = []
  private alertThresholds: Map<string, number> = new Map()

  private constructor() {
    this.initializeThresholds()
    this.startMonitoring()
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Initialize performance thresholds
  private initializeThresholds(): void {
    this.alertThresholds.set('api_response_time', 2000) // 2 seconds
    this.alertThresholds.set('database_query_time', 1000) // 1 second
    this.alertThresholds.set('ui_render_time', 100) // 100ms
    this.alertThresholds.set('network_latency', 500) // 500ms
    this.alertThresholds.set('error_rate', 5) // 5%
    this.alertThresholds.set('memory_usage', 80) // 80%
    this.alertThresholds.set('cpu_usage', 80) // 80%
  }

  // Start monitoring
  private startMonitoring(): void {
    // Monitor API performance
    this.monitorAPIPerformance()
    
    // Monitor database performance
    this.monitorDatabasePerformance()
    
    // Monitor UI performance
    this.monitorUIPerformance()
    
    // Monitor network performance
    this.monitorNetworkPerformance()
    
    // Monitor security performance
    this.monitorSecurityPerformance()
  }

  // =====================================================
  // METRIC COLLECTION
  // =====================================================

  // Record a performance metric
  public recordMetric(
    name: string,
    value: number,
    unit: string,
    category: PerformanceMetric['category'],
    severity: PerformanceMetric['severity'] = 'low',
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      id: this.generateId(),
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      category,
      severity,
      metadata
    }

    this.metrics.push(metric)
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Check for alerts
    this.checkAlerts(metric)

    // Notify observers
    this.notifyObservers(metric)
  }

  // Record API performance
  public recordAPIMetric(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    requestSize?: number,
    responseSize?: number
  ): void {
    const severity = this.getSeverity('api_response_time', responseTime)
    
    this.recordMetric(
      'api_response_time',
      responseTime,
      'ms',
      'api',
      severity,
      {
        endpoint,
        method,
        statusCode,
        requestSize,
        responseSize
      }
    )

    // Record error rate if status code indicates error
    if (statusCode >= 400) {
      this.recordMetric(
        'api_error_rate',
        1,
        'count',
        'api',
        'high',
        { endpoint, method, statusCode }
      )
    }
  }

  // Record database performance
  public recordDatabaseMetric(
    query: string,
    executionTime: number,
    rowsAffected: number,
    connectionPool?: string
  ): void {
    const severity = this.getSeverity('database_query_time', executionTime)
    
    this.recordMetric(
      'database_query_time',
      executionTime,
      'ms',
      'database',
      severity,
      {
        query: query.substring(0, 100), // Truncate long queries
        rowsAffected,
        connectionPool
      }
    )
  }

  // Record UI performance
  public recordUIMetric(
    component: string,
    renderTime: number,
    memoryUsage?: number
  ): void {
    const severity = this.getSeverity('ui_render_time', renderTime)
    
    this.recordMetric(
      'ui_render_time',
      renderTime,
      'ms',
      'ui',
      severity,
      {
        component,
        memoryUsage
      }
    )
  }

  // Record network performance
  public recordNetworkMetric(
    url: string,
    latency: number,
    bandwidth?: number,
    packetLoss?: number
  ): void {
    const severity = this.getSeverity('network_latency', latency)
    
    this.recordMetric(
      'network_latency',
      latency,
      'ms',
      'network',
      severity,
      {
        url,
        bandwidth,
        packetLoss
      }
    )
  }

  // Record security performance
  public recordSecurityMetric(
    event: string,
    processingTime: number,
    success: boolean,
    riskLevel?: string
  ): void {
    const severity = success ? 'low' : 'high'
    
    this.recordMetric(
      'security_processing_time',
      processingTime,
      'ms',
      'security',
      severity,
      {
        event,
        success,
        riskLevel
      }
    )
  }

  // =====================================================
  // ALERT MANAGEMENT
  // =====================================================

  // Check for performance alerts
  private checkAlerts(metric: PerformanceMetric): void {
    const threshold = this.alertThresholds.get(metric.name)
    if (!threshold) return

    if (metric.value > threshold) {
      const alert: PerformanceAlert = {
        id: this.generateId(),
        metric: metric.name,
        threshold,
        currentValue: metric.value,
        severity: this.getAlertSeverity(metric.value, threshold),
        message: `${metric.name} exceeded threshold: ${metric.value}${metric.unit} > ${threshold}${metric.unit}`,
        timestamp: new Date().toISOString(),
        resolved: false
      }

      this.alerts.push(alert)
      this.notifyAlert(alert)
    }
  }

  // Get alert severity
  private getAlertSeverity(value: number, threshold: number): 'warning' | 'error' | 'critical' {
    const ratio = value / threshold
    if (ratio > 2) return 'critical'
    if (ratio > 1.5) return 'error'
    return 'warning'
  }

  // Get metric severity
  private getSeverity(metricName: string, value: number): PerformanceMetric['severity'] {
    const threshold = this.alertThresholds.get(metricName)
    if (!threshold) return 'low'

    const ratio = value / threshold
    if (ratio > 2) return 'critical'
    if (ratio > 1.5) return 'high'
    if (ratio > 1) return 'medium'
    return 'low'
  }

  // =====================================================
  // MONITORING METHODS
  // =====================================================

  // Monitor API performance
  private monitorAPIPerformance(): void {
    // Override fetch to monitor API calls
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0] as string
      const method = (args[1] as RequestInit)?.method || 'GET'

      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const responseTime = endTime - startTime

        this.recordAPIMetric(
          url,
          method,
          responseTime,
          response.status,
          args[1]?.body ? JSON.stringify(args[1].body).length : undefined,
          response.headers.get('content-length') ? parseInt(response.headers.get('content-length')!) : undefined
        )

        return response
      } catch (error) {
        const endTime = performance.now()
        const responseTime = endTime - startTime

        this.recordAPIMetric(
          url,
          method,
          responseTime,
          500
        )

        throw error
      }
    }
  }

  // Monitor database performance
  private monitorDatabasePerformance(): void {
    // This would typically be implemented on the backend
    // For now, we'll simulate database monitoring
    setInterval(() => {
      const simulatedQueryTime = Math.random() * 1000
      if (simulatedQueryTime > 500) {
        this.recordDatabaseMetric(
          'SELECT * FROM users',
          simulatedQueryTime,
          Math.floor(Math.random() * 100)
        )
      }
    }, 30000) // Check every 30 seconds
  }

  // Monitor UI performance
  private monitorUIPerformance(): void {
    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      this.recordUIMetric('page_load', loadTime)
    })

    // Monitor component render time
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.recordUIMetric(
            entry.name,
            entry.duration,
            (performance as any).memory?.usedJSHeapSize
          )
        }
      }
    })

    observer.observe({ entryTypes: ['measure'] })
  }

  // Monitor network performance
  private monitorNetworkPerformance(): void {
    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      setInterval(() => {
        this.recordNetworkMetric(
          'connection_check',
          connection.rtt || 0,
          connection.downlink,
          connection.effectiveType === 'slow-2g' ? 10 : 0
        )
      }, 60000) // Check every minute
    }
  }

  // Monitor security performance
  private monitorSecurityPerformance(): void {
    // Monitor authentication performance
    const originalAuth = window.localStorage.getItem
    window.localStorage.getItem = function(key) {
      const startTime = performance.now()
      const result = originalAuth.call(this, key)
      const endTime = performance.now()
      
      if (key.includes('auth') || key.includes('token')) {
        PerformanceMonitor.getInstance().recordSecurityMetric(
          'auth_check',
          endTime - startTime,
          !!result
        )
      }
      
      return result
    }
  }

  // =====================================================
  // REPORTING
  // =====================================================

  // Get performance report
  public getPerformanceReport(period: string = '1h'): PerformanceReport {
    const now = new Date()
    const periodMs = this.getPeriodMs(period)
    const startTime = new Date(now.getTime() - periodMs)
    
    const recentMetrics = this.metrics.filter(
      m => new Date(m.timestamp) >= startTime
    )

    const totalRequests = recentMetrics.filter(m => m.name === 'api_response_time').length
    const averageResponseTime = this.calculateAverage(
      recentMetrics.filter(m => m.name === 'api_response_time').map(m => m.value)
    )
    const errorRate = this.calculateErrorRate(recentMetrics)
    const slowestEndpoints = this.getSlowestEndpoints(recentMetrics)
    const topErrors = this.getTopErrors(recentMetrics)
    const recommendations = this.generateRecommendations(recentMetrics)

    return {
      period,
      totalRequests,
      averageResponseTime,
      errorRate,
      slowestEndpoints,
      topErrors,
      recommendations
    }
  }

  // Get metrics by category
  public getMetricsByCategory(category: PerformanceMetric['category']): PerformanceMetric[] {
    return this.metrics.filter(m => m.category === category)
  }

  // Get active alerts
  public getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(a => !a.resolved)
  }

  // Resolve alert
  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  // Calculate average
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  // Calculate error rate
  private calculateErrorRate(metrics: PerformanceMetric[]): number {
    const totalRequests = metrics.filter(m => m.name === 'api_response_time').length
    const errors = metrics.filter(m => m.name === 'api_error_rate').length
    return totalRequests > 0 ? (errors / totalRequests) * 100 : 0
  }

  // Get slowest endpoints
  private getSlowestEndpoints(metrics: PerformanceMetric[]): Array<{
    endpoint: string
    averageTime: number
    requestCount: number
  }> {
    const endpointMetrics = metrics.filter(m => m.name === 'api_response_time')
    const endpointGroups = new Map<string, number[]>()

    endpointMetrics.forEach(m => {
      const endpoint = m.metadata?.endpoint || 'unknown'
      if (!endpointGroups.has(endpoint)) {
        endpointGroups.set(endpoint, [])
      }
      endpointGroups.get(endpoint)!.push(m.value)
    })

    return Array.from(endpointGroups.entries())
      .map(([endpoint, times]) => ({
        endpoint,
        averageTime: this.calculateAverage(times),
        requestCount: times.length
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 5)
  }

  // Get top errors
  private getTopErrors(metrics: PerformanceMetric[]): Array<{
    error: string
    count: number
    percentage: number
  }> {
    const errorMetrics = metrics.filter(m => m.name === 'api_error_rate')
    const errorGroups = new Map<string, number>()

    errorMetrics.forEach(m => {
      const error = `${m.metadata?.statusCode || 'unknown'}`
      errorGroups.set(error, (errorGroups.get(error) || 0) + 1)
    })

    const total = errorMetrics.length
    return Array.from(errorGroups.entries())
      .map(([error, count]) => ({
        error,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // Generate recommendations
  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = []
    
    const avgResponseTime = this.calculateAverage(
      metrics.filter(m => m.name === 'api_response_time').map(m => m.value)
    )
    
    if (avgResponseTime > 1000) {
      recommendations.push('Consider optimizing API endpoints - average response time is high')
    }
    
    const errorRate = this.calculateErrorRate(metrics)
    if (errorRate > 5) {
      recommendations.push('High error rate detected - investigate and fix failing requests')
    }
    
    const memoryUsage = metrics.filter(m => m.name === 'memory_usage')
    if (memoryUsage.length > 0) {
      const avgMemory = this.calculateAverage(memoryUsage.map(m => m.value))
      if (avgMemory > 80) {
        recommendations.push('High memory usage detected - consider memory optimization')
      }
    }
    
    return recommendations
  }

  // Get period in milliseconds
  private getPeriodMs(period: string): number {
    const periods: Record<string, number> = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000
    }
    return periods[period] || periods['1h']
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // =====================================================
  // OBSERVER PATTERN
  // =====================================================

  // Add observer
  public addObserver(observer: (metric: PerformanceMetric) => void): void {
    this.observers.push(observer)
  }

  // Remove observer
  public removeObserver(observer: (metric: PerformanceMetric) => void): void {
    const index = this.observers.indexOf(observer)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  // Notify observers
  private notifyObservers(metric: PerformanceMetric): void {
    this.observers.forEach(observer => {
      try {
        observer(metric)
      } catch (error) {
        console.error('Error in performance observer:', error)
      }
    })
  }

  // Notify alert
  private notifyAlert(alert: PerformanceAlert): void {
    console.warn('Performance Alert:', alert.message)
    // Here you could send alerts to external services
  }
}

// =====================================================
// EXPORT SINGLETON INSTANCE
// =====================================================

export const performanceMonitor = PerformanceMonitor.getInstance()

// =====================================================
// PERFORMANCE UTILITIES
// =====================================================

// Measure function execution time
export const measureExecution = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now()
  try {
    const result = await fn()
    const endTime = performance.now()
    performanceMonitor.recordMetric(
      'function_execution',
      endTime - startTime,
      'ms',
      'ui',
      'low',
      { functionName: name }
    )
    return result
  } catch (error) {
    const endTime = performance.now()
    performanceMonitor.recordMetric(
      'function_execution_error',
      endTime - startTime,
      'ms',
      'ui',
      'high',
      { functionName: name, error: error instanceof Error ? error.message : 'Unknown error' }
    )
    throw error
  }
}

// Measure component render time
export const measureRender = (componentName: string) => {
  const startTime = performance.now()
  return () => {
    const endTime = performance.now()
    performanceMonitor.recordUIMetric(componentName, endTime - startTime)
  }
}

// Monitor API call
export const monitorAPICall = async <T>(
  endpoint: string,
  method: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now()
  try {
    const result = await apiCall()
    const endTime = performance.now()
    performanceMonitor.recordAPIMetric(endpoint, method, endTime - startTime, 200)
    return result
  } catch (error) {
    const endTime = performance.now()
    const statusCode = error instanceof Error && 'status' in error ? (error as any).status : 500
    performanceMonitor.recordAPIMetric(endpoint, method, endTime - startTime, statusCode)
    throw error
  }
}
