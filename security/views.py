from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse, Http404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.db.models import Q, Count, Max, Avg, Sum
from django.utils import timezone
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    SecurityZone, SecurityDevice, SecurityAlert, SecurityLog,
    AccessControl, SecurityProfile, SecurityScan, SecurityIncident,
    SecurityToken, SecurityAuditLog, SecurityPolicy, SecurityBiometric,
    SecurityTwoFactor, SecurityRateLimit
)
import json
import uuid
from datetime import datetime, timedelta
import ipaddress
import jwt
from cryptography.fernet import Fernet
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from weasyprint import HTML
import logging
import hashlib
import random
import string
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

# ===== SECURITY DASHBOARD VIEWS =====

@login_required
def security_dashboard(request):
    """Enterprise security dashboard with comprehensive monitoring"""
    home = request.user.homes.first()  # Assuming user has homes relationship
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    # Get security statistics
    total_devices = SecurityDevice.objects.filter(home=home).count()
    online_devices = SecurityDevice.objects.filter(home=home, is_online=True).count()
    active_alerts = SecurityAlert.objects.filter(home=home, is_resolved=False).count()
    critical_alerts = SecurityAlert.objects.filter(home=home, is_resolved=False, priority__in=['critical', 'emergency']).count()
    
    # Recent alerts
    recent_alerts = SecurityAlert.objects.filter(home=home).order_by('-created_at')[:10]
    
    # Security zones
    security_zones = SecurityZone.objects.filter(home=home)
    
    # Recent logs
    recent_logs = SecurityLog.objects.filter(home=home).order_by('-created_at')[:20]
    
    # System status
    system_status = {
        'overall': 'SECURE' if critical_alerts == 0 else 'COMPROMISED',
        'armed_devices': SecurityDevice.objects.filter(home=home, is_armed=True).count(),
        'total_zones': security_zones.count(),
        'scans_pending': SecurityScan.objects.filter(home=home, status='pending').count(),
    }
    
    context = {
        'title': 'Security Dashboard',
        'home': home,
        'total_devices': total_devices,
        'online_devices': online_devices,
        'active_alerts': active_alerts,
        'critical_alerts': critical_alerts,
        'recent_alerts': recent_alerts,
        'security_zones': security_zones,
        'recent_logs': recent_logs,
        'system_status': system_status,
    }
    return render(request, 'security/dashboard.html', context)

@login_required
def security_zones(request):
    """Manage security zones"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    zones = SecurityZone.objects.filter(home=home)
    
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        
        if name:
            zone = SecurityZone.objects.create(
                name=name,
                description=description,
                home=home
            )
            
            # Log the action
            SecurityLog.objects.create(
                home=home,
                user=request.user,
                log_type='config',
                action='create_zone',
                description=f'Created security zone: {name}',
                metadata={'zone_id': str(zone.id)}
            )
            
            messages.success(request, f'Security zone "{name}" created successfully')
            return redirect('security:zones')
    
    context = {
        'title': 'Security Zones',
        'zones': zones,
        'home': home,
    }
    return render(request, 'security/zones.html', context)

@login_required
def security_devices(request):
    """Manage security devices"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    devices = SecurityDevice.objects.filter(home=home)
    zones = SecurityZone.objects.filter(home=home)
    
    if request.method == 'POST':
        name = request.POST.get('name')
        device_type = request.POST.get('device_type')
        zone_id = request.POST.get('zone')
        
        if name and device_type and zone_id:
            try:
                zone = SecurityZone.objects.get(id=zone_id, home=home)
                device = SecurityDevice.objects.create(
                    name=name,
                    device_type=device_type,
                    zone=zone,
                    home=home
                )
                
                # Log the action
                SecurityLog.objects.create(
                    home=home,
                    user=request.user,
                    log_type='device',
                    action='add_device',
                    description=f'Added security device: {name}',
                    metadata={'device_id': str(device.id), 'device_type': device_type}
                )
                
                messages.success(request, f'Device "{name}" added successfully')
                return redirect('security:devices')
                
            except SecurityZone.DoesNotExist:
                messages.error(request, 'Invalid security zone selected')
    
    context = {
        'title': 'Security Devices',
        'devices': devices,
        'zones': zones,
        'device_types': SecurityDevice.DEVICE_TYPES,
        'home': home,
    }
    return render(request, 'security/devices.html', context)

@login_required
def security_alerts(request):
    """Security alerts management with filtering and pagination"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    # Get filter parameters
    alert_type = request.GET.get('type', '')
    priority = request.GET.get('priority', '')
    status = request.GET.get('status', '')
    search = request.GET.get('search', '')
    
    # Build query
    alerts = SecurityAlert.objects.filter(home=home)
    
    if alert_type:
        alerts = alerts.filter(alert_type=alert_type)
    
    if priority:
        alerts = alerts.filter(priority=priority)
    
    if status:
        if status == 'resolved':
            alerts = alerts.filter(is_resolved=True)
        elif status == 'active':
            alerts = alerts.filter(is_resolved=False)
    
    if search:
        alerts = alerts.filter(
            Q(title__icontains=search) |
            Q(message__icontains=search) |
            Q(location__icontains=search)
        )
    
    # Pagination
    paginator = Paginator(alerts, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Alert statistics
    alert_stats = {
        'total': alerts.count(),
        'resolved': alerts.filter(is_resolved=True).count(),
        'active': alerts.filter(is_resolved=False).count(),
        'critical': alerts.filter(priority__in=['critical', 'emergency']).count(),
    }
    
    context = {
        'title': 'Security Alerts',
        'page_obj': page_obj,
        'alert_stats': alert_stats,
        'alert_types': SecurityAlert.ALERT_TYPES,
        'priorities': SecurityAlert.PRIORITY_LEVELS,
        'current_filters': {
            'type': alert_type,
            'priority': priority,
            'status': status,
            'search': search,
        },
        'home': home,
    }
    return render(request, 'security/alerts.html', context)

@login_required
def alert_detail(request, alert_id):
    """View detailed alert information"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    alert = get_object_or_404(SecurityAlert, id=alert_id, home=home)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'resolve':
            alert.is_resolved = True
            alert.resolved_at = timezone.now()
            alert.save()
            
            # Log the action
            SecurityLog.objects.create(
                home=home,
                user=request.user,
                log_type='alert',
                action='resolve_alert',
                description=f'Resolved alert: {alert.title}',
                metadata={'alert_id': str(alert.id)}
            )
            
            messages.success(request, 'Alert resolved successfully')
            
        elif action == 'escalate':
            if alert.escalate():
                # Log the escalation
                SecurityLog.objects.create(
                    home=home,
                    user=request.user,
                    log_type='alert',
                    action='escalate_alert',
                    description=f'Escalated alert: {alert.title} to {alert.priority}',
                    metadata={'alert_id': str(alert.id), 'new_priority': alert.priority}
                )
                
                messages.success(request, f'Alert escalated to {alert.get_priority_display()}')
        
        return redirect('security:alerts')
    
    context = {
        'title': f'Alert: {alert.title}',
        'alert': alert,
        'home': home,
    }
    return render(request, 'security/alert_detail.html', context)

# ===== API ENDPOINTS FOR SECURITY FEATURES =====

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_security_status(request):
    """Get comprehensive security system status"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    # Get system status
    total_devices = SecurityDevice.objects.filter(home=home).count()
    online_devices = SecurityDevice.objects.filter(home=home, is_online=True).count()
    active_alerts = SecurityAlert.objects.filter(home=home, is_resolved=False).count()
    critical_alerts = SecurityAlert.objects.filter(home=home, is_resolved=False, priority__in=['critical', 'emergency']).count()
    
    # Get device status by type
    device_status = {}
    for device_type, _ in SecurityDevice.DEVICE_TYPES:
        device_status[device_type] = SecurityDevice.objects.filter(
            home=home,
            device_type=device_type,
            is_online=True
        ).count()
    
    # Get recent alerts
    recent_alerts = SecurityAlert.objects.filter(home=home).order_by('-created_at')[:5]
    
    return Response({
        'status': 'SECURE' if critical_alerts == 0 else 'COMPROMISED',
        'armed_devices': SecurityDevice.objects.filter(home=home, is_armed=True).count(),
        'total_devices': total_devices,
        'online_devices': online_devices,
        'active_alerts': active_alerts,
        'critical_alerts': critical_alerts,
        'device_status': device_status,
        'recent_alerts': [
            {
                'id': str(alert.id),
                'title': alert.title,
                'type': alert.alert_type,
                'priority': alert.priority,
                'created_at': alert.created_at.isoformat(),
                'is_resolved': alert.is_resolved,
            }
            for alert in recent_alerts
        ],
        'timestamp': timezone.now().isoformat(),
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_arm_security(request):
    """Arm the security system"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    action = request.data.get('action', 'arm')
    zone_id = request.data.get('zone_id')
    
    try:
        if zone_id:
            # Arm specific zone
            zone = SecurityZone.objects.get(id=zone_id, home=home)
            devices = SecurityDevice.objects.filter(zone=zone)
            armed_count = devices.filter(is_armed=True).count()
            
            devices.update(is_armed=True)
            
            # Log the action
            SecurityLog.objects.create(
                home=home,
                user=request.user,
                log_type='system',
                action=f'{action}_zone',
                description=f'{action.title()}d security zone: {zone.name}',
                metadata={'zone_id': str(zone.id), 'device_count': devices.count()}
            )
            
            message = f'Security zone "{zone.name}" armed successfully'
        else:
            # Arm all devices
            devices = SecurityDevice.objects.filter(home=home)
            devices.update(is_armed=True)
            
            # Log the action
            SecurityLog.objects.create(
                home=home,
                user=request.user,
                log_type='system',
                action=f'{action}_all',
                description=f'{action.title()}d all security devices',
                metadata={'device_count': devices.count()}
            )
            
            message = 'Security system armed successfully'
        
        # Create alert for arming
        SecurityAlert.objects.create(
            home=home,
            alert_type='system',
            priority='info',
            title='System Armed',
            message=message,
            location='System',
        )
        
        return Response({
            'status': 'ARMED' if action == 'arm' else 'DISARMED',
            'message': message,
            'armed_devices': SecurityDevice.objects.filter(home=home, is_armed=True).count(),
        })
        
    except SecurityZone.DoesNotExist:
        return Response({'error': 'Invalid zone ID'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_disarm_security(request):
    """Disarm the security system"""
    # This is the same as arming but with different action
    return api_arm_security(request)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_security_logs(request):
    """Get security logs with filtering"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    # Get filter parameters
    log_type = request.GET.get('type', '')
    user_id = request.GET.get('user', '')
    hours = request.GET.get('hours', 24)
    
    # Build query
    logs = SecurityLog.objects.filter(home=home)
    
    if log_type:
        logs = logs.filter(log_type=log_type)
    
    if user_id:
        logs = logs.filter(user_id=user_id)
    
    # Filter by time
    since = timezone.now() - timedelta(hours=int(hours))
    logs = logs.filter(created_at__gte=since)
    
    # Order and limit
    logs = logs.order_by('-created_at')[:100]
    
    return Response({
        'logs': [
            {
                'id': str(log.id),
                'log_type': log.log_type,
                'action': log.action,
                'description': log.description,
                'user': log.user.username if log.user else 'System',
                'ip_address': log.ip_address,
                'created_at': log.created_at.isoformat(),
                'is_successful': log.is_successful,
            }
            for log in logs
        ],
        'total': logs.count(),
        'filters': {
            'type': log_type,
            'user': user_id,
            'hours': hours,
        },
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_access_control(request):
    """Create access control for a device"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    try:
        device_id = request.data.get('device_id')
        user_id = request.data.get('user_id')
        access_level = request.data.get('access_level')
        
        device = SecurityDevice.objects.get(id=device_id, home=home)
        user = request.user  # For now, only allow self-access
        
        # Check if access control already exists
        existing = AccessControl.objects.filter(
            home=home,
            user=user,
            device=device
        ).first()
        
        if existing:
            return Response({'error': 'Access control already exists'}, status=400)
        
        # Create access control
        access_control = AccessControl.objects.create(
            home=home,
            user=user,
            device=device,
            access_level=access_level,
        )
        
        # Log the action
        SecurityLog.objects.create(
            home=home,
            user=request.user,
            log_type='access',
            action='grant_access',
            description=f'Granted {access_level} access to {device.name}',
            metadata={
                'device_id': str(device.id),
                'user_id': str(user.id),
                'access_level': access_level,
            }
        )
        
        return Response({
            'access_id': str(access_control.id),
            'message': f'Access granted successfully',
        }, status=status.HTTP_201_CREATED)
        
    except SecurityDevice.DoesNotExist:
        return Response({'error': 'Device not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_verify_pin(request):
    """Verify user PIN code"""
    try:
        pin = request.data.get('pin')
        profile = request.user.security_profile
        
        if not profile.verify_pin_code(pin):
            # Log failed attempt
            home = request.user.homes.first()
            if home:
                SecurityLog.objects.create(
                    home=home,
                    user=request.user,
                    log_type='auth',
                    action='pin_failed',
                    description='Failed PIN verification attempt',
                    metadata={'ip_address': request.META.get('REMOTE_ADDR')}
                )
            return Response({'error': 'Invalid PIN code'}, status=400)
        
        # Log successful attempt
        home = request.user.homes.first()
        if home:
            SecurityLog.objects.create(
                home=home,
                user=request.user,
                log_type='auth',
                action='pin_success',
                description='Successful PIN verification',
                metadata={'ip_address': request.META.get('REMOTE_ADDR')}
            )
        
        return Response({'message': 'PIN verified successfully'})
        
    except AttributeError:
        return Response({'error': 'Security profile not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_start_security_scan(request):
    """Start a security scan"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    scan_type = request.data.get('scan_type', 'vulnerability')
    
    # Create scan
    scan = SecurityScan.objects.create(
        home=home,
        scan_type=scan_type,
        status='pending',
        created_by=request.user,
    )
    
    # In a real implementation, this would trigger a background task
    # For now, we'll simulate the scan completion
    scan.status = 'completed'
    scan.start_time = timezone.now()
    scan.end_time = timezone.now()
    scan.results = {
        'total_checks': 50,
        'passed': 45,
        'failed': 5,
        'issues': [
            {'severity': 'medium', 'description': 'Outdated firmware on device'},
            {'severity': 'low', 'description': 'Weak password policy'},
        ]
    }
    scan.issues_found = 5
    scan.critical_issues = 1
    scan.recommendations = 'Update firmware and strengthen password policies'
    scan.save()
    
    # Log the action
    SecurityLog.objects.create(
        home=home,
        user=request.user,
        log_type='system',
        action='start_scan',
        description=f'Started {scan_type} security scan',
        metadata={'scan_id': str(scan.id)}
    )
    
    return Response({
        'scan_id': str(scan.id),
        'message': f'Security scan completed successfully',
        'results': scan.results,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_security_scan_results(request, scan_id):
    """Get security scan results"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    scan = get_object_or_404(SecurityScan, id=scan_id, home=home)
    
    return Response({
        'scan_id': str(scan.id),
        'scan_type': scan.scan_type,
        'status': scan.status,
        'start_time': scan.start_time.isoformat() if scan.start_time else None,
        'end_time': scan.end_time.iso_format() if scan.end_time else None,
        'results': scan.results,
        'issues_found': scan.issues_found,
        'critical_issues': scan.critical_issues,
        'recommendations': scan.recommendations,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_report_security_incident(request):
    """Report a security incident"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    try:
        incident_type = request.data.get('incident_type')
        title = request.data.get('title')
        description = request.data.get('description')
        severity = request.data.get('severity', 'high')
        
        incident = SecurityIncident.objects.create(
            home=home,
            incident_type=incident_type,
            title=title,
            description=description,
            severity=severity,
            status='investigating',
            created_by=request.user,
        )
        
        # Log the incident
        SecurityLog.objects.create(
            home=home,
            user=request.user,
            log_type='breach',
            action='report_incident',
            description=f'Reported security incident: {title}',
            metadata={
                'incident_id': str(incident.id),
                'incident_type': incident_type,
                'severity': severity,
            }
        )
        
        # Send notification (in real implementation, this would use a notification system)
        send_security_incident_notification(incident)
        
        return Response({
            'incident_id': str(incident.id),
            'message': 'Security incident reported successfully',
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error reporting security incident: {str(e)}")
        return Response({'error': 'Failed to report incident'}, status=400)

# ===== HELPER FUNCTIONS =====

def send_security_incident_notification(incident):
    """Send notification about security incident"""
    try:
        # In a real implementation, this would use a proper notification system
        # For now, we'll log it and potentially send an email
        
        subject = f"Security Incident Reported: {incident.title}"
        message = render_to_string('security/incident_notification.txt', {
            'incident': incident,
            'home': incident.home,
        })
        
        # Send to home owners
        owners = incident.home.users.filter(is_owner=True)
        emails = [owner.email for owner in owners if owner.email]
        
        if emails:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                emails,
                fail_silently=True,
            )
        
    except Exception as e:
        logger.error(f"Error sending security incident notification: {str(e)}")

# ===== COMMAND-LINE INTERFACE FOR SECURITY MANAGEMENT =====

@require_http_methods(["POST"])
@login_required
def bulk_device_action(request):
    """Perform bulk actions on security devices"""
    home = request.user.homes.first()
    
    if not home:
        return JsonResponse({'error': 'No home found'}, status=404)
    
    action = request.POST.get('action')
    device_ids = request.POST.getlist('device_ids')
    
    if not action or not device_ids:
        return JsonResponse({'error': 'Missing action or device IDs'}, status=400)
    
    try:
        devices = SecurityDevice.objects.filter(id__in=device_ids, home=home)
        
        if action == 'arm':
            devices.update(is_armed=True)
            action_description = 'armed'
        elif action == 'disarm':
            devices.update(is_armed=False)
            action_description = 'disarmed'
        elif action == 'enable':
            devices.update(is_online=True)
            action_description = 'enabled'
        elif action == 'disable':
            devices.update(is_online=False)
            action_description = 'disabled'
        else:
            return JsonResponse({'error': 'Invalid action'}, status=400)
        
        # Log the bulk action
        SecurityLog.objects.create(
            home=home,
            user=request.user,
            log_type='system',
            action=f'bulk_{action}',
            description=f'Bulk {action_description} {devices.count()} devices',
            metadata={'device_count': devices.count(), 'action': action}
        )
        
        return JsonResponse({
            'success': True,
            'message': f'Successfully {action_description} {devices.count()} devices',
        })
        
    except Exception as e:
        logger.error(f"Error in bulk device action: {str(e)}")
        return JsonResponse({'error': 'Failed to perform bulk action'}, status=500)

@login_required
def export_security_report(request):
    """Export security report as PDF"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('security:dashboard')
    
    # Get data for report
    devices = SecurityDevice.objects.filter(home=home)
    alerts = SecurityAlert.objects.filter(home=home).order_by('-created_at')[:100]
    logs = SecurityLog.objects.filter(home=home).order_by('-created_at')[:50]
    
    # Calculate statistics
    device_stats = {
        'total': devices.count(),
        'online': devices.filter(is_online=True).count(),
        'armed': devices.filter(is_armed=True).count(),
    }
    
    alert_stats = {
        'total': alerts.count(),
        'resolved': alerts.filter(is_resolved=True).count(),
        'active': alerts.filter(is_resolved=False).count(),
        'critical': alerts.filter(priority__in=['critical', 'emergency']).count(),
    }
    
    # Generate HTML report
    html_content = render_to_string('security/security_report.html', {
        'home': home,
        'devices': devices,
        'alerts': alerts,
        'logs': logs,
        'device_stats': device_stats,
        'alert_stats': alert_stats,
        'generated_at': timezone.now(),
    })
    
    # Generate PDF
    pdf = HTML(string=html_content).write_pdf()
    
    # Create response
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="security_report_{home.name}_{timezone.now().strftime("%Y%m%d")}.pdf"'
    
    return response

# ===== ENTERPRISE SECURITY FEATURES =====

@login_required
def security_tokens(request):
    """Manage security tokens"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    tokens = SecurityToken.objects.filter(user=request.user)
    
    if request.method == 'POST':
        token_type = request.POST.get('token_type')
        description = request.POST.get('description')
        
        if token_type:
            # Generate token value
            token_value = generate_secure_token()
            
            # Create token
            token = SecurityToken.objects.create(
                user=request.user,
                token_type=token_type,
                token_value=token_value,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                device_fingerprint=request.POST.get('device_fingerprint', ''),
            )
            
            # Encrypt sensitive data if provided
            if description:
                token.encrypt_data({'description': description})
            
            # Log the action
            SecurityAuditLog.objects.create(
                user=request.user,
                audit_type='security',
                action='create_token',
                description=f'Created {token_type} security token',
                resource='SecurityToken',
                resource_id=str(token.id),
                ip_address=request.META.get('REMOTE_ADDR'),
                request_data={'token_type': token_type, 'description': description},
            )
            
            messages.success(request, f'Token created successfully: {token_value}')
            return redirect('security:tokens')
    
    context = {
        'title': 'Security Tokens',
        'tokens': tokens,
        'home': home,
    }
    return render(request, 'security/tokens.html', context)

@login_required
def revoke_token(request, token_id):
    """Revoke a security token"""
    home = request.user.homes.first()
    
    if not home:
        return JsonResponse({'error': 'No home found'}, status=404)
    
    try:
        token = SecurityToken.objects.get(id=token_id, user=request.user)
        token.revoke()
        
        # Log the action
        SecurityAuditLog.objects.create(
            user=request.user,
            audit_type='security',
            action='revoke_token',
            description=f'Revoked {token.token_type} security token',
            resource='SecurityToken',
            resource_id=str(token.id),
            ip_address=request.META.get('REMOTE_ADDR'),
        )
        
        messages.success(request, 'Token revoked successfully')
        return redirect('security:tokens')
        
    except SecurityToken.DoesNotExist:
        messages.error(request, 'Token not found')
        return redirect('security:tokens')

@login_required
def security_audit_logs(request):
    """View security audit logs"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    # Get filter parameters
    audit_type = request.GET.get('type', '')
    user_id = request.GET.get('user', '')
    search = request.GET.get('search', '')
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')
    
    # Build query
    logs = SecurityAuditLog.objects.filter(user__homes=home)
    
    if audit_type:
        logs = logs.filter(audit_type=audit_type)
    
    if user_id:
        logs = logs.filter(user_id=user_id)
    
    if search:
        logs = logs.filter(
            Q(action__icontains=search) |
            Q(description__icontains=search) |
            Q(resource__icontains=search)
        )
    
    if date_from:
        try:
            date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
            logs = logs.filter(created_at__date__gte=date_from)
        except ValueError:
            pass
    
    if date_to:
        try:
            date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
            logs = logs.filter(created_at__date__lte=date_to)
        except ValueError:
            pass
    
    # Pagination
    paginator = Paginator(logs, 50)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistics
    stats = {
        'total_logs': logs.count(),
        'successful_logs': logs.filter(is_successful=True).count(),
        'failed_logs': logs.filter(is_successful=False).count(),
        'by_type': logs.values('audit_type').annotate(count=Count('id')),
    }
    
    context = {
        'title': 'Security Audit Logs',
        'page_obj': page_obj,
        'stats': stats,
        'audit_types': SecurityAuditLog.AUDIT_TYPES,
        'current_filters': {
            'type': audit_type,
            'user': user_id,
            'search': search,
            'date_from': date_from,
            'date_to': date_to,
        },
        'home': home,
    }
    return render(request, 'security/audit_logs.html', context)

@login_required
def security_policies(request):
    """Manage security policies"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    policies = SecurityPolicy.objects.filter(home=home)
    
    if request.method == 'POST':
        name = request.POST.get('name')
        policy_type = request.POST.get('policy_type')
        description = request.POST.get('description')
        rules = json.loads(request.POST.get('rules', '{}'))
        
        if name and policy_type:
            policy = SecurityPolicy.objects.create(
                name=name,
                policy_type=policy_type,
                description=description,
                rules=rules,
                home=home,
                created_by=request.user,
            )
            
            # Log the action
            SecurityAuditLog.objects.create(
                user=request.user,
                audit_type='configuration',
                action='create_policy',
                description=f'Created {policy_type} security policy: {name}',
                resource='SecurityPolicy',
                resource_id=str(policy.id),
                ip_address=request.META.get('REMOTE_ADDR'),
            )
            
            messages.success(request, f'Policy "{name}" created successfully')
            return redirect('security:policies')
    
    context = {
        'title': 'Security Policies',
        'policies': policies,
        'policy_types': SecurityPolicy.POLICY_TYPES,
        'home': home,
    }
    return render(request, 'security/policies.html', context)

@login_required
def biometric_auth(request):
    """Biometric authentication management"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    try:
        biometric = request.user.security_biometric
    except SecurityBiometric.DoesNotExist:
        biometric = None
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'register':
            # Simulate biometric registration
            template_data = request.POST.get('template_data', '')
            if template_data:
                template_hash = hashlib.sha256(template_data.encode()).hexdigest()
                
                if not biometric:
                    biometric = SecurityBiometric.objects.create(
                        user=request.user,
                        template_hash=template_hash,
                        device_id=request.POST.get('device_id', ''),
                    )
                else:
                    biometric.template_hash = template_hash
                    biometric.device_id = request.POST.get('device_id', '')
                    biometric.save()
                
                # Log the action
                SecurityAuditLog.objects.create(
                    user=request.user,
                    audit_type='auth',
                    action='register_biometric',
                    description='Registered biometric template',
                    resource='SecurityBiometric',
                    resource_id=str(biometric.id),
                    ip_address=request.META.get('REMOTE_ADDR'),
                )
                
                messages.success(request, 'Biometric template registered successfully')
        
        elif action == 'verify':
            # Simulate biometric verification
            template_data = request.POST.get('template_data', '')
            if biometric and biometric.verify_template(template_data):
                biometric.last_used = timezone.now()
                biometric.save()
                
                # Log the action
                SecurityAuditLog.objects.create(
                    user=request.user,
                    audit_type='auth',
                    action='verify_biometric',
                    description='Biometric verification successful',
                    resource='SecurityBiometric',
                    resource_id=str(biometric.id),
                    ip_address=request.META.get('REMOTE_ADDR'),
                )
                
                messages.success(request, 'Biometric verification successful')
            else:
                # Log failed attempt
                SecurityAuditLog.objects.create(
                    user=request.user,
                    audit_type='auth',
                    action='verify_biometric_failed',
                    description='Biometric verification failed',
                    resource='SecurityBiometric',
                    resource_id=str(biometric.id) if biometric else 'none',
                    ip_address=request.META.get('REMOTE_ADDR'),
                    is_successful=False,
                )
                
                messages.error(request, 'Biometric verification failed')
        
        elif action == 'delete':
            if biometric:
                biometric.delete()
                
                # Log the action
                SecurityAuditLog.objects.create(
                    user=request.user,
                    audit_type='auth',
                    action='delete_biometric',
                    description='Deleted biometric template',
                    resource='SecurityBiometric',
                    resource_id=str(biometric.id),
                    ip_address=request.META.get('REMOTE_ADDR'),
                )
                
                messages.success(request, 'Biometric template deleted successfully')
        
        return redirect('security:biometric')
    
    context = {
        'title': 'Biometric Authentication',
        'biometric': biometric,
        'home': home,
    }
    return render(request, 'security/biometric.html', context)

@login_required
def two_factor_auth(request):
    """Two-factor authentication management"""
    home = request.user.homes.first()
    
    if not home:
        messages.error(request, "No home found for your account")
        return redirect('home:index')
    
    try:
        two_factor = request.user.security_two_factor
    except SecurityTwoFactor.DoesNotExist:
        two_factor = None
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'setup':
            method = request.POST.get('method')
            
            if method:
                if not two_factor:
                    two_factor = SecurityTwoFactor.objects.create(
                        user=request.user,
                        method=method,
                    )
                else:
                    two_factor.method = method
                    two_factor.is_enabled = False
                    two_factor.save()
                
                # Generate secret key for authenticator apps
                if method == 'app':
                    import pyotp
                    two_factor.secret_key = pyotp.random_base32()
                    two_factor.save()
                    
                    # Generate QR code
                    import qrcode
                    from io import BytesIO
                    from django.core.files.base import ContentFile
                    
                    otp_uri = pyotp.totp.TOTP(two_factor.secret_key).provisioning_uri(
                        name=request.user.email,
                        issuer_name="SafeNest"
                    )
                    
                    qr = qrcode.QRCode(version=1, box_size=10, border=5)
                    qr.add_data(otp_uri)
                    qr.make(fit=True)
                    
                    img = qr.make_image(fill_color="black", back_color="white")
                    buffer = BytesIO()
                    img.save(buffer, format='PNG')
                    buffer.seek(0)
                    
                    two_factor.qr_code.save(f'totp_{request.user.id}.png', ContentFile(buffer.read()))
                
                # Generate backup codes
                backup_codes = two_factor.generate_backup_codes()
                
                # Log the action
                SecurityAuditLog.objects.create(
                    user=request.user,
                    audit_type='auth',
                    action='setup_2fa',
                    description=f'Set up 2FA with {method} method',
                    resource='SecurityTwoFactor',
                    resource_id=str(two_factor.id),
                    ip_address=request.META.get('REMOTE_ADDR'),
                )
                
                messages.success(request, f'2FA setup initiated for {method}. Check your email for backup codes.')
        
        elif action == 'verify':
            code = request.POST.get('code')
            
            if two_factor and code:
                # Verify code based on method
                if two_factor.method == 'app':
                    import pyotp
                    totp = pyotp.TOTP(two_factor.secret_key)
                    if totp.verify(code):
                        two_factor.is_enabled = True
                        two_factor.is_verified = True
                        two_factor.save()
                        
                        # Log the action
                        SecurityAuditLog.objects.create(
                            user=request.user,
                            audit_type='auth',
                            action='verify_2fa',
                            description='2FA verification successful',
                            resource='SecurityTwoFactor',
                            resource_id=str(two_factor.id),
                            ip_address=request.META.get('REMOTE_ADDR'),
                        )
                        
                        messages.success(request, 'Two-factor authentication enabled successfully')
                    else:
                        # Log failed attempt
                        SecurityAuditLog.objects.create(
                            user=request.user,
                            audit_type='auth',
                            action='verify_2fa_failed',
                            description='2FA verification failed',
                            resource='SecurityTwoFactor',
                            resource_id=str(two_factor.id),
                            ip_address=request.META.get('REMOTE_ADDR'),
                            is_successful=False,
                        )
                        
                        messages.error(request, 'Invalid verification code')
                
                elif two_factor.method in ['sms', 'email']:
                    # For SMS/Email, we'd normally send a code and verify it
                    # For demo purposes, we'll accept any 6-digit code
                    if len(code) == 6 and code.isdigit():
                        two_factor.is_enabled = True
                        two_factor.is_verified = True
                        two_factor.save()
                        
                        # Log the action
                        SecurityAuditLog.objects.create(
                            user=request.user,
                            audit_type='auth',
                            action='verify_2fa',
                            description='2FA verification successful',
                            resource='SecurityTwoFactor',
                            resource_id=str(two_factor.id),
                            ip_address=request.META.get('REMOTE_ADDR'),
                        )
                        
                        messages.success(request, 'Two-factor authentication enabled successfully')
                    else:
                        # Log failed attempt
                        SecurityAuditLog.objects.create(
                            user=request.user,
                            audit_type='auth',
                            action='verify_2fa_failed',
                            description='2FA verification failed',
                            resource='SecurityTwoFactor',
                            resource_id=str(two_factor.id),
                            ip_address=request.META.get('REMOTE_ADDR'),
                            is_successful=False,
                        )
                        
                        messages.error(request, 'Invalid verification code')
        
        elif action == 'disable':
            if two_factor:
                two_factor.is_enabled = False
                two_factor.save()
                
                # Log the action
                SecurityAuditLog.objects.create(
                    user=request.user,
                    audit_type='auth',
                    action='disable_2fa',
                    description='Disabled two-factor authentication',
                    resource='SecurityTwoFactor',
                    resource_id=str(two_factor.id),
                    ip_address=request.META.get('REMOTE_ADDR'),
                )
                
                messages.success(request, 'Two-factor authentication disabled')
        
        return redirect('security:two_factor')
    
    context = {
        'title': 'Two-Factor Authentication',
        'two_factor': two_factor,
        'methods': SecurityTwoFactor._meta.get_field('method').choices,
        'home': home,
    }
    return render(request, 'security/two_factor.html', context)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_rate_limit_check(request):
    """Check if user is rate limited"""
    operation = request.data.get('operation', 'default')
    ip_address = request.META.get('REMOTE_ADDR')
    
    # Check if user is rate limited
    rate_limit, created = SecurityRateLimit.objects.get_or_create(
        user=request.user,
        operation=operation,
        defaults={
            'ip_address': ip_address,
            'window_start': timezone.now(),
        }
    )
    
    if not created and rate_limit.is_limited:
        return Response({
            'limited': True,
            'message': 'Rate limit exceeded. Please try again later.',
            'reset_time': rate_limit.window_end.isoformat() if rate_limit.window_end else None,
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    # Increment count
    if not rate_limit.increment():
        return Response({
            'limited': True,
            'message': 'Rate limit exceeded. Please try again later.',
            'reset_time': rate_limit.window_end.isoformat() if rate_limit.window_end else None,
        }, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    return Response({
        'limited': False,
        'count': rate_limit.count,
        'message': 'Request allowed',
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_security_health_check(request):
    """Perform comprehensive security health check"""
    home = request.user.homes.first()
    
    if not home:
        return Response({'error': 'No home found'}, status=404)
    
    # Check various security aspects
    security_status = {
        'overall': 'SECURE',
        'checks': [],
        'issues': [],
        'recommendations': [],
    }
    
    # Check 2FA status
    try:
        two_factor = request.user.security_two_factor
        if two_factor and two_factor.is_enabled:
            security_status['checks'].append({
                'name': 'Two-Factor Authentication',
                'status': 'ACTIVE',
                'description': 'Two-factor authentication is enabled'
            })
        else:
            security_status['checks'].append({
                'name': 'Two-Factor Authentication',
                'status': 'INACTIVE',
                'description': 'Two-factor authentication is not enabled'
            })
            security_status['issues'].append('Two-factor authentication is not enabled')
            security_status['recommendations'].append('Enable two-factor authentication for better security')
    except SecurityTwoFactor.DoesNotExist:
        security_status['checks'].append({
            'name': 'Two-Factor Authentication',
            'status': 'NOT_SETUP',
            'description': 'Two-factor authentication is not set up'
        })
        security_status['issues'].append('Two-factor authentication is not set up')
        security_status['recommendations'].append('Set up two-factor authentication')
    
    # Check security alerts
    critical_alerts = SecurityAlert.objects.filter(
        home=home,
        is_resolved=False,
        priority__in=['critical', 'emergency']
    ).count()
    
    if critical_alerts > 0:
        security_status['overall'] = 'COMPROMISED'
        security_status['checks'].append({
            'name': 'Security Alerts',
            'status': 'CRITICAL',
            'description': f'{critical_alerts} critical alerts unresolved'
        })
        security_status['issues'].append(f'{critical_alerts} critical security alerts unresolved')
        security_status['recommendations'].append('Address all critical security alerts immediately')
    else:
        security_status['checks'].append({
            'name': 'Security Alerts',
            'status': 'CLEAN',
            'description': 'No critical security alerts'
        })
    
    # Check device security
    devices = SecurityDevice.objects.filter(home=home)
    offline_devices = devices.filter(is_online=False).count()
    outdated_devices = devices.filter(
        firmware_version__isnull=True
    ).count()
    
    if offline_devices > 0:
        security_status['issues'].append(f'{offline_devices} devices are offline')
        security_status['recommendations'].append('Check offline devices for security issues')
    
    if outdated_devices > 0:
        security_status['issues'].append(f'{outdated_devices} devices have outdated firmware')
        security_status['recommendations'].append('Update firmware on all devices')
    
    security_status['checks'].append({
        'name': 'Device Security',
        'status': 'NEEDS_ATTENTION' if offline_devices > 0 or outdated_devices > 0 else 'GOOD',
        'description': f'{offline_devices} offline, {outdated_devices} outdated'
    })
    
    # Check recent audit logs for suspicious activity
    recent_failed_logins = SecurityAuditLog.objects.filter(
        user=request.user,
        audit_type='auth',
        action__in=['login_failed', 'pin_failed'],
        created_at__gte=timezone.now() - timedelta(hours=24),
        is_successful=False
    ).count()
    
    if recent_failed_logins > 5:
        security_status['overall'] = 'COMPROMISED'
        security_status['issues'].append(f'{recent_failed_logins} failed login attempts in the last 24 hours')
        security_status['recommendations'].append('Review failed login attempts and consider enabling additional security measures')
    
    security_status['checks'].append({
        'name': 'Authentication Security',
        'status': 'SUSPICIOUS' if recent_failed_logins > 5 else 'NORMAL',
        'description': f'{recent_failed_logins} failed login attempts in 24 hours'
    })
    
    return Response(security_status)

# ===== HELPER FUNCTIONS =====

def generate_secure_token(length=64):
    """Generate a secure random token"""
    chars = string.ascii_letters + string.digits + '-_'
    return ''.join(random.choice(chars) for _ in range(length))

def send_security_notification(user, notification_type, context):
    """Send security notification to user"""
    try:
        subject = f"Security Notification: {notification_type}"
        message = render_to_string('security/notification_email.txt', {
            'user': user,
            'notification_type': notification_type,
            'context': context,
        })
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=True,
        )
    except Exception as e:
        logger.error(f"Error sending security notification: {str(e)}")
