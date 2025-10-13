import nodemailer from 'nodemailer';

// Konfigurasi SMTP Hostinger
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // true untuk port 465, false untuk port lainnya
    auth: {
        user: process.env.EMAIL_SMPT,
        pass: process.env.PASSWORD_SMPT
    }
});

// Template email untuk notifikasi pesan private baru
const createPrivateMessageEmailTemplate = (recipientName: string, senderNickname: string) => {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesan Private Baru - Bisikberbisik</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.5;
                color: #2d3748;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
            }
            .email-container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .badge {
                background: rgba(255,255,255,0.2);
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                display: inline-block;
            }
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #2d3748;
            }
            .message-box {
                background: #f7fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .message-text {
                font-size: 16px;
                color: #4a5568;
                margin-bottom: 16px;
            }
            .highlight {
                color: #667eea;
                font-weight: 600;
            }
            .sender-card {
                background: #edf2f7;
                border-radius: 8px;
                padding: 16px;
                margin: 20px 0;
            }
            .sender-row {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            .sender-row:last-child {
                margin-bottom: 0;
            }
            .icon {
                width: 20px;
                margin-right: 12px;
                text-align: center;
            }
            .info-text {
                color: #4a5568;
                font-size: 14px;
            }
            .cta-container {
                text-align: center;
                margin: 30px 0;
            }
            .cta-button {
                display: inline-block;
                background: white;
                color: #667eea;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: transform 0.2s;
                border: 2px solid #667eea;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background: #f7fafc;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-text {
                color: #718096;
                font-size: 12px;
                line-height: 1.4;
            }
            .footer-text:not(:last-child) {
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">Bisikberbisik</div>
                <div class="badge">Pesan Private Baru</div>
            </div>
            
            <div class="content">
                <div class="greeting">Halo ${recipientName}! 👋</div>
                
                <div class="message-box">
                    <div class="message-text">
                        Anda memiliki <span class="highlight">1 Pesan Private Baru</span><br>
                        yang menunggu untuk dibaca!
                    </div>
                </div>
                
                <div class="sender-card">
                    <div class="sender-row">
                        <div class="icon">👤</div>
                        <div class="info-text"><strong>Dari:</strong> ${senderNickname}</div>
                    </div>
                    <div class="sender-row">
                        <div class="icon">⏰</div>
                        <div class="info-text"><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</div>
                    </div>
                </div>
                
                <div class="cta-container">
                    <a href="https://bisikberbisik.com/message" class="cta-button">📖 Baca Pesan Sekarang</a>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-text">Email ini dikirim secara otomatis dari sistem Bisikberbisik.</div>
                <div class="footer-text">Jika Anda tidak ingin menerima notifikasi email, silakan hubungi administrator.</div>
                <div class="footer-text">&copy; 2025 Bisikberbisik. All rights reserved.</div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Fungsi untuk mengirim email notifikasi pesan private
const sendPrivateMessageNotification = async (recipientEmail: string, recipientName: string, senderNickname: string) => {
    try {
        console.log('📧 Sending private message notification email...');
        console.log('👤 Recipient:', recipientEmail);
        console.log('👤 Sender Nickname:', senderNickname);

        const mailOptions = {
            from: process.env.EMAIL_SMPT,
            to: recipientEmail,
            subject: `Pesan Private Baru dari ${senderNickname} - Bisikberbisik`,
            html: createPrivateMessageEmailTemplate(recipientName, senderNickname)
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', result.messageId);

        return {
            success: true,
            messageId: result.messageId
        };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send email notification');
    }
};

// Fungsi untuk test koneksi email
const testEmailConnection = async () => {
    try {
        console.log('🔍 Testing email connection...');
        await transporter.verify();
        console.log('✅ Email connection successful');
        return true;
    } catch (error) {
        console.error('❌ Email connection failed:', error);
        return false;
    }
};

export default {
    sendPrivateMessageNotification,
    testEmailConnection
};
