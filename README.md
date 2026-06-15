# Wedding Guests

A web application to search and manage guest records. 🔍🕵🏻✨📢📍🪑🍽️

## Overview

This is a Vue.js-based guest management system built with Vite, designed to help you organize and track guest information for your wedding event.

## Prerequisites

- Node.js 22.12 or later
- npm 10 or later

## Installation & Setup

```bash
# Use the correct Node.js version
nvm use 22.12

# Navigate to the app directory
cd app

# Install dependencies
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5520` by default.

## Build for Production

To create a production build:

```bash
npm run build
```

## Features

- 主頁登入功能 (Login Functionality)
- 賓客列表 (Guest Records)
- 管理賓客資訊 (Manage Guest Information)
- 顯示座位資訊 (View Seating Arrangements)
- 追蹤餐點偏好 (Track Meal Preferences)
- 即時人數統計 (Real-time Guest Count Summary)

## Project Structure

```
app/
├── src/
│   ├── components/    # Vue components
│   ├── composables/   # Vue composables
│   ├── App.vue        # Root component
│   ├── main.js        # Application entry point
│   └── style.css      # Global styles
├── public/            # Static assets
├── index.html         # HTML template
├── package.json       # Project dependencies
└── vite.config.js     # Vite configuration
```
