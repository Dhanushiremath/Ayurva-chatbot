# Rasa Setup Guide for Ayurva

## Prerequisites

Rasa requires Python 3.8, 3.9, or 3.10 (NOT 3.11+)

## Step 1: Install Python 3.10

### Download and Install
1. Go to: https://www.python.org/downloads/release/python-31011/
2. Download: **Windows installer (64-bit)**
3. Run installer with these options:
   - ✅ Add Python 3.10 to PATH
   - ✅ Install pip
   - Installation directory: `C:\Python310`

### Verify Installation
```powershell
py -3.10 --version
# Should show: Python 3.10.11
```

## Step 2: Create Virtual Environment

```powershell
cd backend
py -3.10 -m venv rasa-env
```

## Step 3: Activate Virtual Environment

```powershell
.\rasa-env\Scripts\Activate.ps1
```

If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Step 4: Install Rasa

```powershell
pip install --upgrade pip
pip install rasa
```

This will take 5-10 minutes.

## Step 5: Initialize Rasa Project

```powershell
cd rasa-bot
rasa init --no-prompt
```

## Step 6: Test Rasa

```powershell
rasa shell
```

Type "hello" to test!

## Next Steps

After successful installation, I'll help you:
1. Configure Rasa for medical conversations
2. Create training data with symptoms and health queries
3. Train the model
4. Set up REST API endpoint
5. Integrate with Node.js backend

## Troubleshooting

### Error: "Python version not supported"
- Make sure you're using Python 3.10: `py -3.10 --version`
- Recreate virtual environment with correct Python version

### Error: "Microsoft Visual C++ required"
- Download and install: https://aka.ms/vs/17/release/vc_redist.x64.exe

### Error: "pip install fails"
- Update pip: `python -m pip install --upgrade pip`
- Try: `pip install rasa --use-deprecated=legacy-resolver`

## Why Python 3.10?

- Rasa 3.x supports Python 3.8, 3.9, 3.10
- Python 3.11+ has breaking changes
- Python 3.10 is the latest supported version

## Alternative: Use Rasa X (Cloud)

If local installation is problematic:
- Sign up at: https://rasa.com/
- Use Rasa X cloud platform
- No local Python installation needed
