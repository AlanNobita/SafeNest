from django.db import models
from django.contrib.auth.models import User
from django.core.validators import validate_ipv4_address, validate_ipv6_address
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from core.models import Home
import uuid
import hashlib
import json
import jwt
from cryptography.fernet import Fernet
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class SecurityZone(models.Model):
    """Represents a security zone within a home"""
    name = models.CharField(max_length=100)
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_zones')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.home.name} - {self.name}"

class SecurityDevice(models.Model):
    """Represents a security device (camera, sensor, lock, etc.)"""
    DEVICE_TYPES = [
        ('camera', 'Security Camera'),
        ('motion', 'Motion Sensor'),
        ('door', 'Door Sensor'),
        ('window', 'Window Sensor'),
        ('lock', 'Smart Lock'),
        ('alarm', 'Alarm System'),
        ('smoke', 'Smoke Detector'),
        ('co', 'Carbon Monoxide Detector'),
        ('water', 'Water Leak Sensor'),
        ('thermostat', 'Thermostat Sensor'),
    ]
    
    device_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=100)
    device_type = models.CharField(max_length=20, choices=DEVICE_TYPES)
    zone = models.ForeignKey(SecurityZone, on_delete=models.CASCADE, related_name='devices')
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_devices')
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    mac_address = models.CharField(max_length=17, blank=True, null=True)
    firmware_version = models.CharField(max_length=50, blank=True)
    is_online = models.BooleanField(default=True)
    is_armed = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def clean(self):
        if self.ip_address:
            try:
                validate_ipv4_address(self.ip_address)
            except ValidationError:
                try:
                    validate_ipv6_address(self.ip_address)
                except ValidationError:
                    raise ValidationError({'ip_address': 'Enter a valid IPv4 or IPv6 address'})
    
    def __str__(self):
        return f"{self.name} ({self.device_type})"

class SecurityAlert(models.Model):
    """Enhanced security alert system with enterprise features"""
    ALERT_TYPES = [
        ('fire', 'Fire Detection'),
        ('gas', 'Gas Leak'),
        ('intrusion', 'Intrusion'),
        ('temperature', 'Temperature Alert'),
        ('motion', 'Motion Detected'),
        ('door', 'Door/Window Open'),
        ('water', 'Water Leak'),
        ('system', 'System Alert'),
        ('breach', 'Security Breach'),
        ('tamper', 'Device Tampering'),
    ]
    
    PRIORITY_LEVELS = [
        ('info', 'Information'),
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
        ('emergency', 'Emergency'),
    ]
    
    alert_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_alerts')
    device = models.ForeignKey(SecurityDevice, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    title = models.CharField(max_length=200)
    message = models.TextField()
    location = models.CharField(max_length=200, blank=True)
    is_resolved = models.BooleanField(default=False)
    is_acknowledged = models.BooleanField(default=False)
    acknowledged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['home', 'is_resolved', 'created_at']),
            models.Index(fields=['priority', 'is_resolved']),
            models.Index(fields=['alert_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.get_priority_display()}"
    
    def escalate(self):
        """Escalate alert priority"""
        escalation_order = ['info', 'low', 'medium', 'high', 'critical', 'emergency']
        current_index = escalation_order.index(self.priority)
        
        if current_index < len(escalation_order) - 1:
            self.priority = escalation_order[current_index + 1]
            self.save()
            return True
        return False

class SecurityLog(models.Model):
    """Comprehensive security logging system"""
    LOG_TYPES = [
        ('auth', 'Authentication'),
        ('device', 'Device Activity'),
        ('alert', 'Alert Activity'),
        ('access', 'Access Control'),
        ('system', 'System Event'),
        ('config', 'Configuration Change'),
        ('breach', 'Security Breach'),
        ('audit', 'Audit Trail'),
    ]
    
    log_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    log_type = models.CharField(max_length=20, choices=LOG_TYPES)
    action = models.CharField(max_length=100)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    device = models.ForeignKey(SecurityDevice, on_delete=models.SET_NULL, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    is_successful = models.BooleanField(default=True)
    severity = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='info')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['home', 'log_type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['is_successful', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_log_type_display()} - {self.action}"

class AccessControl(models.Model):
    """Enterprise-grade access control system"""
    access_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='access_controls')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='security_access')
    device = models.ForeignKey(SecurityDevice, on_delete=models.CASCADE, related_name='access_controls')
    access_level = models.CharField(max_length=20, choices=[
        ('admin', 'Administrator'),
        ('owner', 'Owner'),
        ('family', 'Family Member'),
        ('guest', 'Guest'),
        ('service', 'Service Provider'),
        ('emergency', 'Emergency Access'),
    ])
    is_active = models.BooleanField(default=True)
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_used = models.DateTimeField(null=True, blank=True)
    access_count = models.PositiveIntegerField(default=0)
    restrictions = models.JSONField(default=dict, blank=True)
    
    class Meta:
        unique_together = ['home', 'user', 'device']
        indexes = [
            models.Index(fields=['home', 'user', 'is_active']),
            models.Index(fields=['device', 'access_level']),
        ]
    
    def is_valid(self):
        """Check if access is still valid"""
        if not self.is_active:
            return False
        
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        
        return True
    
    def record_access(self):
        """Record access attempt"""
        self.access_count += 1
        self.last_used = timezone.now()
        self.save()
    
    def __str__(self):
        return f"{self.user.username} - {self.device.name} ({self.access_level})"

class SecurityProfile(models.Model):
    """User security profile with preferences and settings"""
    profile_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_profile')
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_profiles')
    two_factor_enabled = models.BooleanField(default=False)
    biometric_enabled = models.BooleanField(default=False)
    pin_code = models.CharField(max_length=6, blank=True)
    emergency_contacts = models.JSONField(default=list, blank=True)
    notification_preferences = models.JSONField(default=dict, blank=True)
    security_level = models.CharField(max_length=20, choices=[
        ('basic', 'Basic'),
        ('enhanced', 'Enhanced'),
        ('enterprise', 'Enterprise'),
    ], default='enhanced')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def set_pin_code(self, pin):
        """Set and hash PIN code"""
        if len(pin) != 6 or not pin.isdigit():
            raise ValueError("PIN must be 6 digits")
        
        hashed_pin = hashlib.sha256(pin.encode()).hexdigest()
        self.pin_code = hashed_pin
        self.save()
    
    def verify_pin_code(self, pin):
        """Verify PIN code"""
        if not self.pin_code:
            return False
        
        hashed_pin = hashlib.sha256(pin.encode()).hexdigest()
        return hashed_pin == self.pin_code
    
    def __str__(self):
        return f"{self.user.username} - {self.security_level}"

class SecurityScan(models.Model):
    """Security vulnerability and compliance scanning"""
    scan_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_scans')
    scan_type = models.CharField(max_length=50, choices=[
        ('vulnerability', 'Vulnerability Scan'),
        ('compliance', 'Compliance Check'),
        ('penetration', 'Penetration Test'),
        ('audit', 'Security Audit'),
    ])
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ], default='pending')
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    results = models.JSONField(default=dict, blank=True)
    issues_found = models.PositiveIntegerField(default=0)
    critical_issues = models.PositiveIntegerField(default=0)
    recommendations = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['home', 'scan_type', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.home.name} - {self.get_scan_type_display()} ({self.status})"

class SecurityIncident(models.Model):
    """Track and manage security incidents"""
    INCIDENT_TYPES = [
        ('breach', 'Security Breach'),
        ('attack', 'Cyber Attack'),
        ('malware', 'Malware Detection'),
        ('phishing', 'Phishing Attempt'),
        ('unauthorized', 'Unauthorized Access'),
        ('data_loss', 'Data Loss'),
        ('ddos', 'DDoS Attack'),
        ('ransomware', 'Ransomware'),
    ]
    
    incident_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_incidents')
    incident_type = models.CharField(max_length=20, choices=INCIDENT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='high')
    status = models.CharField(max_length=20, choices=[
        ('investigating', 'Investigating'),
        ('contained', 'Contained'),
        ('resolved', 'Resolved'),
        ('escalated', 'Escalated'),
    ], default='investigating')
    detected_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    affected_systems = models.JSONField(default=list, blank=True)
    mitigation_actions = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_incidents')
    
    class Meta:
        ordering = ['-detected_at']
        indexes = [
            models.Index(fields=['home', 'incident_type', 'status']),
            models.Index(fields=['severity', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.get_severity_display()}"

class SecurityToken(models.Model):
    """Enterprise-grade security token management"""
    TOKEN_TYPES = [
        ('api', 'API Access Token'),
        ('refresh', 'Refresh Token'),
        ('session', 'Session Token'),
        ('device', 'Device Token'),
        ('emergency', 'Emergency Access Token'),
    ]
    
    token_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='security_tokens')
    token_type = models.CharField(max_length=20, choices=TOKEN_TYPES)
    token_value = models.CharField(max_length=500, unique=True)
    encrypted_data = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_used = models.DateTimeField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    device_fingerprint = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'token_type', 'is_active']),
            models.Index(fields=['token_type', 'expires_at']),
        ]
        ordering = ['-created_at']
    
    def encrypt_data(self, data):
        """Encrypt sensitive data using Fernet encryption"""
        key = Fernet.generate_key()
        f = Fernet(key)
        encrypted = f.encrypt(json.dumps(data).encode())
        self.encrypted_data = encrypted.decode()
        self.save()
        return key
    
    def decrypt_data(self, key):
        """Decrypt sensitive data"""
        if not self.encrypted_data:
            return None
        
        try:
            f = Fernet(key)
            decrypted = f.decrypt(self.encrypted_data.encode())
            return json.loads(decrypted.decode())
        except Exception as e:
            logger.error(f"Error decrypting data: {str(e)}")
            return None
    
    def is_valid(self):
        """Check if token is still valid"""
        if not self.is_active:
            return False
        
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        
        return True
    
    def record_usage(self, ip_address=None, user_agent=None):
        """Record token usage"""
        self.last_used = timezone.now()
        self.ip_address = ip_address
        self.user_agent = user_agent
        self.save()
    
    def revoke(self):
        """Revoke the token"""
        self.is_active = False
        self.save()
    
    def __str__(self):
        return f"{self.user.username} - {self.get_token_type_display()}"

class SecurityAuditLog(models.Model):
    """Comprehensive security audit logging"""
    AUDIT_TYPES = [
        ('auth', 'Authentication'),
        ('permission', 'Permission Change'),
        ('data_access', 'Data Access'),
        ('configuration', 'Configuration Change'),
        ('system', 'System Event'),
        ('security', 'Security Event'),
        ('compliance', 'Compliance Check'),
        ('backup', 'Backup/Restore'),
    ]
    
    audit_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    audit_type = models.CharField(max_length=20, choices=AUDIT_TYPES)
    action = models.CharField(max_length=100)
    description = models.TextField()
    resource = models.CharField(max_length=200, blank=True)
    resource_id = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    request_data = models.JSONField(default=dict, blank=True)
    response_data = models.JSONField(default=dict, blank=True)
    is_successful = models.BooleanField(default=True)
    severity = models.CharField(max_length=10, choices=SecurityAlert.PRIORITY_LEVELS, default='info')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['audit_type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['resource', 'resource_id']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_audit_type_display()} - {self.action}"

class SecurityPolicy(models.Model):
    """Enterprise security policies and rules"""
    POLICY_TYPES = [
        ('password', 'Password Policy'),
        ('access', 'Access Control'),
        ('data_retention', 'Data Retention'),
        ('encryption', 'Encryption'),
        ('network', 'Network Security'),
        ('device', 'Device Security'),
        ('audit', 'Audit Policy'),
        ('compliance', 'Compliance'),
    ]
    
    policy_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=100)
    policy_type = models.CharField(max_length=20, choices=POLICY_TYPES)
    description = models.TextField()
    rules = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    is_enforced = models.BooleanField(default=True)
    home = models.ForeignKey(Home, on_delete=models.CASCADE, related_name='security_policies')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['home', 'policy_type', 'is_active']),
            models.Index(fields=['is_enforced', 'created_at']),
        ]
    
    def evaluate_rule(self, rule_name, context):
        """Evaluate a specific security rule"""
        if rule_name not in self.rules:
            return True  # Rule not found, allow by default
        
        rule = self.rules[rule_name]
        rule_type = rule.get('type', 'condition')
        
        if rule_type == 'condition':
            # Evaluate condition-based rules
            conditions = rule.get('conditions', [])
            for condition in conditions:
                if not self._evaluate_condition(condition, context):
                    return False
            return True
        
        elif rule_type == 'threshold':
            # Evaluate threshold-based rules
            threshold = rule.get('threshold', 0)
            current_value = context.get(rule.get('field', 0), 0)
            return current_value <= threshold
        
        elif rule_type == 'list':
            # Evaluate list-based rules
            allowed_values = rule.get('allowed_values', [])
            current_value = context.get(rule.get('field', ''))
            return current_value in allowed_values
        
        return True  # Default allow
    
    def _evaluate_condition(self, condition, context):
        """Evaluate a single condition"""
        field = condition.get('field', '')
        operator = condition.get('operator', 'equals')
        value = condition.get('value', '')
        
        if field not in context:
            return False
        
        current_value = context[field]
        
        if operator == 'equals':
            return current_value == value
        elif operator == 'not_equals':
            return current_value != value
        elif operator == 'contains':
            return str(value).lower() in str(current_value).lower()
        elif operator == 'greater_than':
            return float(current_value) > float(value)
        elif operator == 'less_than':
            return float(current_value) < float(value)
        elif operator == 'in':
            return current_value in value if isinstance(value, list) else False
        
        return False
    
    def __str__(self):
        return f"{self.name} - {self.get_policy_type_display()}"

class SecurityBiometric(models.Model):
    """Biometric authentication storage"""
    biometric_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_biometric')
    template_hash = models.CharField(max_length=500)
    template_version = models.CharField(max_length=50, default='1.0')
    device_id = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    last_used = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['device_id']),
        ]
    
    def verify_template(self, template_data):
        """Verify biometric template"""
        # In a real implementation, this would use proper biometric matching algorithms
        # For now, we'll simulate the verification
        import hashlib
        current_hash = hashlib.sha256(template_data.encode()).hexdigest()
        return current_hash == self.template_hash
    
    def __str__(self):
        return f"{self.user.username} - Biometric"

class SecurityTwoFactor(models.Model):
    """Two-factor authentication settings"""
    two_factor_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_two_factor')
    method = models.CharField(max_length=20, choices=[
        ('app', 'Authenticator App'),
        ('sms', 'SMS'),
        ('email', 'Email'),
        ('hardware', 'Hardware Token'),
    ])
    secret_key = models.CharField(max_length=100, blank=True)
    backup_codes = models.JSONField(default=list, blank=True)
    is_enabled = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    last_used = models.DateTimeField(null=True, blank=True)
    device_trusted = models.BooleanField(default=False)
    trusted_devices = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'is_enabled']),
        ]
    
    def generate_backup_codes(self):
        """Generate backup codes for 2FA"""
        import random
        import string
        
        codes = []
        for _ in range(10):
            code = ''.join(random.choices(string.digits, k=8))
            codes.append(code)
        
        self.backup_codes = codes
        self.save()
        return codes
    
    def verify_backup_code(self, code):
        """Verify a backup code"""
        if code in self.backup_codes:
            self.backup_codes.remove(code)
            self.save()
            return True
        return False
    
    def __str__(self):
        return f"{self.user.username} - {self.get_method_display()}"

class SecurityRateLimit(models.Model):
    """Rate limiting for security-sensitive operations"""
    rate_limit_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='security_rate_limits')
    operation = models.CharField(max_length=50)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    endpoint = models.CharField(max_length=200, blank=True)
    count = models.PositiveIntegerField(default=0)
    window_start = models.DateTimeField(auto_now_add=True)
    window_end = models.DateTimeField(null=True, blank=True)
    is_limited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'operation', 'window_start']),
            models.Index(fields=['ip_address', 'operation']),
        ]
        ordering = ['-created_at']
    
    def increment(self):
        """Increment the rate limit count"""
        self.count += 1
        self.save()
        
        # Check if limit exceeded (default: 5 requests per minute)
        if self.count >= 5:
            self.is_limited = True
            self.save()
            return False
        return True
    
    def reset_window(self):
        """Reset the rate limit window"""
        self.count = 0
        self.window_start = timezone.now()
        self.is_limited = False
        self.save()
    
    def __str__(self):
        return f"{self.user.username} - {self.operation} ({self.count})"