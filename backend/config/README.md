# Configuration Files

## Firebase Service Account

To enable push notifications, place your Firebase service account JSON file here:

**File name:** `firebase-service-account.json`

### How to get this file:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Save the downloaded file as `firebase-service-account.json` in this directory

### File structure example:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### Security Note:

⚠️ **NEVER commit this file to git!**

This file contains sensitive credentials. It's already added to `.gitignore`.

### Enable Firebase:

After adding the file, update your `.env`:

```env
FIREBASE_ENABLED=true
```

Then restart your backend server.
