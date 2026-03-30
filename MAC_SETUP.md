# How to Run Coin Buddy on a Mac

To run this project on a Mac from your GitHub repository, follow these steps:

## Prerequisites
1.  **Install Node.js**: Download from [nodejs.org](https://nodejs.org/).
2.  **Install Xcode**: Get it from the Mac App Store.
3.  **Install Cocoapods**: Run this in your terminal:
    ```bash
    sudo gem install cocoapods
    ```

## Step 1: Clone and Install
Open your terminal and run:
```bash
git clone <your-repo-url>
cd coin-buddy-themes
npm install
```

## Step 2: Prepare the iOS Project
Sync the web code to the iOS native project:
```bash
npx cap sync ios
```

## Step 3: Run the App
To open the project in Xcode and run it:
```bash
npx cap open ios
```
1. In Xcode, select your device or a simulator at the top.
2. Click the **Play** button (Run).

## Updating the App
Each time you make changes to your React/Vite code, run:
```bash
npm run build
npx cap sync ios
```
Then go back to Xcode and run the app again.
