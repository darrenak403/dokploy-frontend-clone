# Hướng dẫn cấu hình Cloudflare Tunnel cho Dokploy

## Tại sao cần Cloudflare Tunnel?

Cloudflare Tunnel tạo một kết nối bảo mật từ Cloudflare đến server của bạn mà **không cần expose ports** ra internet. Tunnel sẽ kết nối trực tiếp đến Docker internal network.

## Cấu hình trên Dokploy

### 1. Trong Dokploy Dashboard

Khi tạo service, cấu hình như sau:

**Frontend Admin:**
- Container Name: `frontend-admin`
- Internal Port: `5173`
- **Không cần Public Port** (để trống)
- Domain: `admin.dupssapp.id.vn`

**Frontend User:**
- Container Name: `frontend-user`
- Internal Port: `5174`
- **Không cần Public Port** (để trống)
- Domain: `dupssapp.id.vn`

**Nginx:**
- Container Name: `nginx-proxy`
- Internal Port: `80`
- **Không cần Public Port** (để trống)

### 2. Cấu hình Cloudflare Tunnel

#### A. Tạo Tunnel trên Cloudflare Dashboard

1. Vào **Cloudflare Dashboard** → **Zero Trust** → **Access** → **Tunnels**
2. Click **Create a tunnel**
3. Đặt tên: `dokploy-frontend-tunnel`
4. Cài đặt cloudflared trên server Dokploy:

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared

# Authenticate
cloudflared tunnel login
```

5. Tạo tunnel:
```bash
cloudflared tunnel create dokploy-frontend-tunnel
```

6. Copy Tunnel Token từ dashboard

#### B. Thêm Cloudflared vào Docker Compose

Thêm service này vào `docker-compose.yml`:

```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    command: tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
    restart: unless-stopped
    networks:
      - app-network
```

**Thay `YOUR_TUNNEL_TOKEN` bằng token từ Cloudflare Dashboard**

#### C. Hoặc dùng config file (khuyến nghị)

1. Copy file `cloudflare-tunnel.yml` vào server

2. Tạo file credentials:
```bash
# File này được tạo khi chạy: cloudflared tunnel create
# Located at: ~/.cloudflared/<TUNNEL_ID>.json
```

3. Thêm vào docker-compose:
```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    volumes:
      - ./cloudflare-tunnel.yml:/etc/cloudflared/config.yml:ro
      - ~/.cloudflared:/root/.cloudflared:ro
    command: tunnel --config /etc/cloudflared/config.yml run dokploy-frontend-tunnel
    restart: unless-stopped
    networks:
      - app-network
```

### 3. Cấu hình DNS trên Cloudflare

Tunnel sẽ tự động tạo CNAME records, hoặc bạn có thể tạo thủ công:

1. Vào **Cloudflare Dashboard** → **DNS**
2. Thêm records:
   - Type: `CNAME`, Name: `admin`, Target: `<TUNNEL_ID>.cfargotunnel.com`
   - Type: `CNAME`, Name: `@`, Target: `<TUNNEL_ID>.cfargotunnel.com`

### 4. Cấu hình Routes trong Tunnel

Trong Cloudflare Tunnel Dashboard → **Public Hostname**:

**Route 1 (Admin):**
- Public hostname: `admin.dupssapp.id.vn`
- Service type: `HTTP`
- URL: `nginx-proxy:80`

**Route 2 (User):**
- Public hostname: `dupssapp.id.vn`
- Service type: `HTTP`
- URL: `nginx-proxy:80`

## Kiểm tra

1. **Xem logs của cloudflared:**
```bash
docker logs -f cloudflared-tunnel
```

2. **Test domains:**
```bash
curl -I https://admin.dupssapp.id.vn
curl -I https://dupssapp.id.vn
```

## Lưu ý

- ✅ **KHÔNG cần expose ports** ra ngoài (`ports:` → `expose:`)
- ✅ Cloudflare Tunnel kết nối đến **container names** trong Docker network
- ✅ Tự động có HTTPS (SSL) từ Cloudflare
- ✅ Bảo mật hơn vì không expose IP server
- ✅ DDoS protection tự động

## Troubleshooting

### Tunnel không kết nối được
- Kiểm tra cloudflared logs: `docker logs cloudflared-tunnel`
- Xác nhận token đúng
- Kiểm tra network: `docker network inspect app-network`

### 502 Bad Gateway
- Kiểm tra nginx và frontends đang chạy: `docker ps`
- Test internal connection: `docker exec cloudflared-tunnel wget -O- http://nginx-proxy:80`

### DNS không resolve
- Kiểm tra CNAME records trên Cloudflare
- Flush DNS cache: `ipconfig /flushdns` (Windows) hoặc `sudo systemd-resolve --flush-caches` (Linux)
