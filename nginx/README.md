# Nginx Configuration cho Dokploy Frontend

## Cấu trúc
```
nginx/
├── Dockerfile          # Build nginx image
└── nginx.conf          # Cấu hình nginx
```

## Cấu hình hiện tại

### Frontend Admin
- **Internal Port**: 5173
- **Domain**: admin.yourdomain.com
- **Access**: http://admin.yourdomain.com

### Frontend User
- **Internal Port**: 5174
- **Domain**: user.yourdomain.com
- **Access**: http://user.yourdomain.com

## Chạy ứng dụng

1. **Build và start tất cả services**:
```bash
docker-compose up -d --build
```

2. **Kiểm tra logs**:
```bash
docker-compose logs -f nginx
```

3. **Stop services**:
```bash
docker-compose down
```

## Cấu hình Domain

### Development (Local)
Thêm vào file `hosts` của bạn:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac**: `/etc/hosts`

```
127.0.0.1 admin.yourdomain.com
127.0.0.1 user.yourdomain.com
```

Sau đó truy cập:
- Admin: http://admin.yourdomain.com
- User: http://user.yourdomain.com

### Production
Cập nhật domain trong `nginx/nginx.conf`:
```nginx
# Cho admin
server_name admin.yourdomain.com;

# Cho user
server_name user.yourdomain.com;
```

## Tính năng

- ✅ Reverse proxy cho 2 frontend
- ✅ WebSocket support (cho HMR trong development)
- ✅ Gzip compression
- ✅ Health check endpoints
- ✅ Proper headers (X-Real-IP, X-Forwarded-For, etc.)
- ✅ Connection timeouts

## Health Check

Kiểm tra trạng thái của services:
```bash
# Admin health
curl http://admin.yourdomain.com/health

# User health
curl http://user.yourdomain.com/health
```

## SSL/HTTPS (Optional)

Để thêm SSL, bạn cần:

1. Uncomment port 443 trong `docker-compose.yml`
2. Thêm SSL certificates vào `nginx/certs/`
3. Cập nhật `nginx.conf` để thêm SSL configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;
    
    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;
    
    # ... rest of config
}
```

## Troubleshooting

### Không thể truy cập được
1. Kiểm tra containers đang chạy: `docker-compose ps`
2. Kiểm tra logs: `docker-compose logs nginx`
3. Kiểm tra ports: `netstat -ano | findstr :80`

### 502 Bad Gateway
- Kiểm tra frontend services đang chạy
- Kiểm tra network connectivity: `docker-compose exec nginx ping frontend-admin`

### Domain không resolve
- Kiểm tra file hosts đã được cấu hình đúng
- Flush DNS cache (Windows): `ipconfig /flushdns`
