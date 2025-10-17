# Database Update Scripts

This directory contains scripts for updating the database and sending email notifications.

## Update Message Created By Script

### Purpose
Updates all existing `created_by` values in the `message_history` table to use the sender's nickname instead of UUIDs.

### Usage

#### Option 1: Using npm script (Recommended)
```bash
npm run update-message-created-by
```

#### Option 2: Direct execution
```bash
npx ts-node src/scripts/update-message-created-by.ts
```

### What it does
1. Connects to the database
2. Fetches all message history records with their sender information
3. Updates each record's `created_by` field to use the sender's nickname
4. If sender nickname is not available, uses "Anonymous" as fallback
5. Provides detailed logging of the update process
6. Shows a summary of updated records

### Sample Output
```
🚀 Starting script to update message_history created_by to use sender nickname...
✅ Database connected
📊 Found 150 message records to update
✅ Updated message abc-123: "user-uuid-456" → "john_doe"
✅ Updated message def-789: "user-uuid-789" → "jane_smith"
⏭️  Skipped message ghi-012: already using nickname

📈 Summary:
  Total messages processed: 150
  Successfully updated: 148
  Errors: 0
  Skipped (already correct): 2

🔍 Sample of updated records:
  1. Message ID: abc-123
     Created by: john_doe
     Sender nickname: john_doe
     Sender name: John Doe

✅ Script completed successfully!
🔌 Database connection closed
```

### Migration Alternative

If you prefer to use TypeORM migrations, you can run the migration file:

```bash
npm run migrate
```

This will execute the migration file: `src/db/migrations/1760662556157-update-message-history-created-by-to-nickname.ts`

### Reverting Changes

To revert the changes (restore UUIDs), you can run:

```bash
npm run migrate:revert
```

**Note**: This will only work if you used the migration approach, not the standalone script.

## Feature Announcement Email Scripts

### Test Feature Announcement Script

#### Purpose
Sends a test feature announcement email to one user to verify the email template and configuration.

#### Usage
```bash
npm run test-feature-announcement
```

#### What it does
1. Connects to the database
2. Tests email connection
3. Finds the first user in the database
4. Sends a test feature announcement email
5. Shows the result

### Blast Feature Announcement Script

#### Purpose
Sends feature announcement emails to ALL users in the database about new features.

#### Usage
```bash
npm run blast-feature-announcement
```

#### What it does
1. Connects to the database
2. Tests email connection
3. Fetches all users from the database
4. Sends emails in batches to avoid rate limiting
5. Provides detailed progress and error reporting
6. Shows summary statistics

#### Features
- **Batch Processing**: Processes users in batches of 10 to avoid overwhelming the email server
- **Rate Limiting**: Adds delays between emails and batches
- **Error Handling**: Continues processing even if some emails fail
- **Progress Tracking**: Shows real-time progress and statistics
- **Safety Confirmation**: 10-second countdown before starting

#### Sample Output
```
⚠️  WARNING: This will send emails to ALL users in the database!
📧 Make sure you have:
   • Valid SMTP configuration
   • Email template ready
   • Permission to send bulk emails

Press Ctrl+C to cancel, or wait 10 seconds to continue...

🚀 Starting email blast...
✅ Database connected
✅ Email connection successful
📊 Found 150 users to send emails to
📦 Processing 15 batches of 10 users each

📤 Processing batch 1/15 (10 users)...
📧 Sending to user1@example.com (John Doe)...
✅ Sent to user1@example.com
...

============================================================
📈 EMAIL BLAST SUMMARY
============================================================
📊 Total users processed: 150
✅ Successfully sent: 148
❌ Failed to send: 2
📦 Total batches: 15

🎉 Feature announcement emails sent successfully!
📧 Users should receive emails about the new features:
   • Nickname display in messages
   • Email notifications for private messages
```

### Email Template

The feature announcement uses a beautiful HTML email template located at:
`src/templates/feature-update-email.html`

The template includes:
- **Responsive Design**: Works on desktop and mobile
- **Feature Highlights**: Clear explanation of both new features
- **Call-to-Action**: Button to visit the app
- **Professional Styling**: Clean, modern design
- **Personalization**: Uses user's name and app URL

### Environment Variables Required

Make sure these are set in your `.env` file:
```
EMAIL_SMPT=your-email@domain.com
PASSWORD_SMPT=your-email-password
APP_URL=https://your-app-domain.com
```
