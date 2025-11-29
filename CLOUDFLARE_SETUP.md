# Cloudflare Tunnel Setup (Dokploy)

## Cấu hình trên Dokploy

Dokploy chạy cloudflared riêng biệt, không trong docker-compose này.

### 1. Cấu hình Public Hostnames trong Cloudflare Tunnel

Vào Cloudflare Dashboard → Zero Trust → Access → Tunnels → Chọn tunnel của bạn

**Admin Frontend:**
- Public hostname: `admin.dupssapp.id.vn`
- Service Type: `HTTP`
- URL: `http://localhost:6002`

**User Frontend:**  
- Public hostname: `dupssapp.id.vn` (hoặc `lab.dupssapp.id.vn`)
- Service Type: `HTTP`
- URL: `http://localhost:6001`

### 2. Lý do dùng localhost

- Frontend containers map ports ra host: `6001:80` và `6002:80`
- Cloudflared của Dokploy chạy trên host, không trong Docker network
- Do đó dùng `localhost:6001` và `localhost:6002` thay vì container names

### 3. Kiểm tra

```bash
# Test local
curl http://localhost:6001
curl http://localhost:6002

# Test qua Cloudflare
curl https://dupssapp.id.vn
curl https://admin.dupssapp.id.vn
```

## Nếu muốn chạy cloudflared trong Docker

Thêm vào docker-compose.yml:

```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    command: tunnel --no-autoupdate run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    restart: unless-stopped
    networks:
      - app-network
    depends_on:
      - frontend-user
      - frontend-admin
```

Và config Cloudflare Tunnel với container names:
- `http://frontend-admin:80`
- `http://frontend-user:80`
