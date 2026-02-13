# Chrome Installation

If Chrome is not detected by `scripts/check_chrome.sh`, install it using one of these methods.

## Linux / WSL2

**Option 1: Direct download (recommended)**

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb
```

**Option 2: Add Google's repository**

```bash
# Add signing key
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg

# Add repository
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list

# Install
sudo apt update
sudo apt install -y google-chrome-stable
```

**Option 3: Chromium (open-source alternative)**

```bash
sudo apt update
sudo apt install -y chromium-browser
```

## Windows

**Option 1: Download from Google**
Visit https://www.google.com/chrome/ and run the installer.

**Option 2: Using winget**

```powershell
winget install Google.Chrome
```

**Option 3: Using Chocolatey**

```powershell
choco install googlechrome
```

**Option 4: PowerShell direct download**

```powershell
$installer = "$env:TEMP\chrome_installer.exe"
Invoke-WebRequest -Uri "https://dl.google.com/chrome/install/latest/chrome_installer.exe" -OutFile $installer
Start-Process -FilePath $installer -Args "/silent /install" -Wait
Remove-Item $installer
```

## Verify Installation

After installation, verify with:

```bash
bash scripts/check_chrome.sh <environment>
```
