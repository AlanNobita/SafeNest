
/**
 * SafeNest Enterprise Security Charts
 * Advanced interactive data visualization for security monitoring
 */

class EnterpriseSecurityCharts {
    constructor() {
        this.charts = new Map();
        this.data = {
            securityAlerts: [],
            deviceStatus: [],
            accessPatterns: [],
            threatIntelligence: [],
            compliance: [],
            auditLogs: []
        };
        this.realTimeInterval = null;
        this.init();
    }

    init() {
        this.loadSecurityData();
        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.setupAdvancedInteractions();
    }

    // Load security data
    async loadSecurityData() {
        try {
            // Fetch security alerts data
            const alertsResponse = await fetch('/api/security/alerts/');
            if (alertsResponse.ok) {
                const alertsData = await alertsResponse.json();
                this.data.securityAlerts = this.processAlertsData(alertsData.alerts || []);
            }

            // Fetch device status data
            const devicesResponse = await fetch('/api/security/devices/');
            if (devicesResponse.ok) {
                const devicesData = await devicesResponse.json();
                this.data.deviceStatus = this.processDeviceData(devicesData.devices || []);
            }

            // Generate mock data for other visualizations
            this.data.accessPatterns = this.generateAccessPatternData();
            this.data.threatIntelligence = this.generateThreatIntelligenceData();
            this.data.compliance = this.generateComplianceData();
            this.data.auditLogs = this.generateAuditLogData();

        } catch (error) {
            console.error('Error loading security data:', error);
            // Use fallback data
            this.loadFallbackData();
        }
    }

    // Process alerts data for visualization
    processAlertsData(alerts) {
        return alerts.map(alert => ({
            id: alert.id,
            type: alert.alert_type,
            priority: alert.priority,
            title: alert.title,
            timestamp: new Date(alert.created_at),
            isResolved: alert.is_resolved,
            device: alert.device ? alert.device.name : 'System'
        }));
    }

    // Process device data for visualization
    processDeviceData(devices) {
        return devices.map(device => ({
            id: device.id,
            name: device.name,
            type: device.device_type,
            status: device.is_online ? 'online' : 'offline',
            isArmed: device.is_armed,
            lastSeen: device.last_seen ? new Date(device.last_seen) : new Date(),
            zone: device.zone ? device.zone.name : 'Unknown'
        }));
    }

    // Generate access pattern data
    generateAccessPatternData() {
        const patterns = [];
        const now = new Date();
        
        // Generate hourly access patterns for the last 24 hours
        for (let i = 23; i >= 0; i--) {
            const hour = new Date(now - i * 60 * 60 * 1000);
            patterns.push({
                hour: hour.getHours(),
                successful: Math.floor(Math.random() * 50) + 20,
                failed: Math.floor(Math.random() * 10),
                suspicious: Math.floor(Math.random() * 5)
            });
        }
        
        return patterns;
    }

    // Generate threat intelligence data
    generateThreatIntelligenceData() {
        const threats = [
            { type: 'Malware', severity: 'high', count: 3, trend: 'up' },
            { type: 'Phishing', severity: 'medium', count: 12, trend: 'stable' },
            { type: 'Brute Force', severity: 'high', count: 7, trend: 'down' },
            { type: 'DDoS', severity: 'critical', count: 1, trend: 'up' },
            { type: 'Vulnerability', severity: 'medium', count: 5, trend: 'stable' }
        ];
        
        return threats;
    }

    // Generate compliance data
    generateComplianceData() {
        const standards = [
            { name: 'GDPR', compliance: 95, issues: 2, lastAudit: new Date('2023-10-15') },
            { name: 'ISO 27001', compliance: 88, issues: 5, lastAudit: new Date('2023-09-20') },
            { name: 'SOC 2', compliance: 92, issues: 3, lastAudit: new Date('2023-10-01') },
            { name: 'HIPAA', compliance: 85, issues: 7, lastAudit: new Date('2023-08-30') }
        ];
        
        return standards;
    }

    // Generate audit log data
    generateAuditLogData() {
        const logs = [];
        const now = new Date();
        const actions = ['login', 'logout', 'device_access', 'policy_change', 'alert_acknowledge'];
        
        for (let i = 0; i < 50; i++) {
            const time = new Date(now - Math.random() * 24 * 60 * 60 * 1000);
            logs.push({
                id: `log-${i}`,
                user: `user-${Math.floor(Math.random() * 5)}`,
                action: actions[Math.floor(Math.random() * actions.length)],
