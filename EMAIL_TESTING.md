# Email Notification Testing Guide

## Overview
Sistem email notification telah diintegrasikan ke dalam aplikasi Bisik Berbisik untuk mengirim notifikasi ketika ada pesan private baru.

## Konfigurasi Email
- **SMTP Host**: smtp.hostinger.com
- **Port**: 465 (SSL)
- **Username**: admin-noreply@bisikberbisik.com
- **Password**: Babangakas1!

## Endpoints untuk Testing

### 1. Test Koneksi Email
```http
GET /api/email/test-connection
```

**Response Success:**
```json
{
    "success": true,
    "message": "Email connection successful"
}
```

### 2. Test Kirim Email Notification
```http
POST /api/email/test-send
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "recipient_email": "test@example.com",
    "recipient_name": "John Doe",
    "sender_nickname": "TestUser"
}
```

**Response Success:**
```json
{
    "success": true,
    "data": {
        "success": true,
        "messageId": "<message-id>"
    },
    "message": "Test email sent successfully"
}
```

## Cara Kerja Email Notification

1. **Trigger**: Email notification akan otomatis terkirim ketika ada pesan private baru dibuat melalui endpoint `POST /api/message/create`
2. **Kondisi**: Hanya pesan dengan `is_private: true` yang akan mengirim email notification
3. **Recipient**: Email akan dikirim ke alamat email penerima pesan
4. **Template**: Email menggunakan template HTML yang menarik dengan informasi:
   - Nama penerima
   - Nickname pengirim
   - Waktu pesan
   - Link untuk membaca pesan

## Template Email

Email notification menggunakan template HTML yang mencakup:
- Header dengan logo Bisik Berbisik
- Badge notifikasi "Pesan Private Baru"
- Informasi pengirim dan waktu
- Call-to-action button
- Footer dengan informasi sistem

## Error Handling

- Jika email gagal dikirim, pesan tetap akan tersimpan di database
- Error email akan di-log tetapi tidak akan mengganggu proses penyimpanan pesan
- Koneksi email akan diverifikasi saat startup aplikasi

## Testing Steps

1. **Test Koneksi**:
   ```bash
   curl -X GET http://localhost:3000/api/email/test-connection
   ```

2. **Test Kirim Email** (dengan token auth):
   ```bash
   curl -X POST http://localhost:3000/api/email/test-send \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "recipient_email": "test@example.com",
       "recipient_name": "Test User",
       "sender_nickname": "TestSender"
     }'
   ```

3. **Test Real Message**:
   - Login ke aplikasi
   - Kirim pesan private ke user lain
   - Cek email penerima untuk notifikasi

## Troubleshooting

### Email tidak terkirim
1. Cek koneksi internet
2. Verifikasi kredensial SMTP Hostinger
3. Cek log aplikasi untuk error details
4. Test koneksi email terlebih dahulu

### Template email tidak muncul dengan benar
1. Pastikan email client mendukung HTML
2. Cek apakah email masuk ke folder spam
3. Verifikasi format template HTML

## Security Notes

- Email credentials disimpan di kode (untuk development)
- Untuk production, gunakan environment variables
- Email notification hanya untuk pesan private
- Tidak ada informasi sensitif yang dikirim via email
