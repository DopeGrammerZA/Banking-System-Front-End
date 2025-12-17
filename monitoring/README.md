# Banking App Monitoring Stack

Complete monitoring solution using Prometheus and Grafana for the Banking App.

## Components

### Prometheus
- **Purpose:** Metrics collection and alerting
- **Port:** 9090 (local) / 30090 (Kubernetes)
- **Features:**
  - Service health monitoring
  - Request rate tracking
  - Error rate monitoring
  - Performance metrics
  - Custom alerts

### Grafana
- **Purpose:** Visualization and dashboards
- **Port:** 3001 (local) / 30300 (Kubernetes)
- **Default Credentials:**
  - Username: `admin`
  - Password: `admin123`
- **Features:**
  - Real-time dashboards
  - Custom visualizations
  - Alert management
  - Multi-source data

### Node Exporter
- **Purpose:** System metrics collection
- **Port:** 9100
- **Metrics:** CPU, memory, disk, network

### cAdvisor
- **Purpose:** Container metrics
- **Port:** 8080
- **Metrics:** Container resource usage

---

## Quick Start

### Local Development (Docker Compose)

```bash
# Start monitoring stack
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Check status
docker-compose -f docker-compose.monitoring.yml ps

# View logs
docker-compose -f docker-compose.monitoring.yml logs -f

# Stop stack
docker-compose -f docker-compose.monitoring.yml down
```

**Access:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Node Exporter: http://localhost:9100
- cAdvisor: http://localhost:8080

---

### Kubernetes Deployment

```bash
# Deploy Prometheus
kubectl apply -f ../kubernetes/deployments/prometheus-deployment.yaml
kubectl apply -f ../kubernetes/services/prometheus-service.yaml

# Deploy Grafana
kubectl apply -f ../kubernetes/deployments/grafana-deployment.yaml
kubectl apply -f ../kubernetes/services/grafana-service.yaml

# Check status
kubectl get pods -l app=prometheus
kubectl get pods -l app=grafana

# Access services
kubectl get services prometheus-service
kubectl get services grafana-service
```

**Access:**
- Prometheus: http://localhost:30090
- Grafana: http://localhost:30300

---

## Grafana Setup

### 1. First Login
1. Go to http://localhost:3001 (or :30300 for K8s)
2. Login with `admin` / `admin123`
3. Change password when prompted (optional)

### 2. Add Prometheus Data Source
1. Click **Configuration** (gear icon) → **Data Sources**
2. Click **Add data source**
3. Select **Prometheus**
4. Set URL:
   - Local: `http://prometheus:9090`
   - K8s: `http://prometheus-service:9090`
5. Click **Save & Test**

### 3. Import Dashboard
1. Click **+** → **Import**
2. Upload `grafana/dashboard.json`
3. Select Prometheus data source
4. Click **Import**

---

## Available Metrics

### Request Metrics
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration
- `http_requests_active` - Active connections

### System Metrics
- `up` - Service availability (1 = up, 0 = down)
- `process_cpu_seconds_total` - CPU usage
- `process_resident_memory_bytes` - Memory usage

### Application Metrics
- `database_connection_errors_total` - DB connection errors
- Custom business metrics (to be added)

---

## Alerts

### Configured Alerts

1. **ServiceDown**
   - Triggers when service is down for 2+ minutes
   - Severity: Critical

2. **HighErrorRate**
   - Triggers when 5xx error rate > 5%
   - Severity: Critical

3. **HighResponseTime**
   - Triggers when 95th percentile > 1 second
   - Severity: Warning

4. **HighCPUUsage**
   - Triggers when CPU > 80%
   - Severity: Warning

5. **HighMemoryUsage**
   - Triggers when memory > 1GB
   - Severity: Warning

### View Alerts
- Prometheus: http://localhost:9090/alerts
- Grafana: Alerting section

---

## Troubleshooting

### Prometheus not collecting metrics
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify service discovery
kubectl get endpoints
```

### Grafana can't connect to Prometheus
```bash
# Check network connectivity
kubectl exec -it <grafana-pod> -- curl http://prometheus-service:9090/-/healthy

# Check Prometheus service
kubectl get svc prometheus-service
```

### No data in dashboards
- Wait 1-2 minutes for initial data collection
- Verify Prometheus is scraping targets
- Check time range in Grafana (top-right)

---

## Customization

### Add Custom Metrics

Edit `prometheus/prometheus.yml`:
```yaml
scrape_configs:
  - job_name: 'my-custom-service'
    static_configs:
      - targets: ['my-service:8080']
```

### Add Custom Alerts

Edit `prometheus/alert_rules.yml`:
```yaml
- alert: MyCustomAlert
  expr: my_metric > 100
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "Custom alert triggered"
```

### Create Custom Dashboard
1. In Grafana, click **+** → **Dashboard**
2. Add panels with PromQL queries
3. Save dashboard
4. Export as JSON for version control

---

## Best Practices

1. **Monitor what matters:** Focus on SLIs (Service Level Indicators)
2. **Set meaningful thresholds:** Avoid alert fatigue
3. **Use labels:** Organize metrics with labels
4. **Regular backups:** Export dashboards and alert rules
5. **Security:** Change default passwords in production

---

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)