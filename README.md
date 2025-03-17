<img src="src/assets/img/icon-128.png" width="64"/>

# Auto-Enroll Udemy Extension

A Chrome extension that automates the enrollment process for Udemy courses, saving time and streamlining your educational journey.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/YOUR_EXTENSION_ID)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/YOUR_EXTENSION_ID)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/YOUR_EXTENSION_ID)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)

## Overview

The Auto-Enroll Udemy Extension is designed to simplify and automate the process of enrolling in Udemy courses. With a single click, you can enroll in multiple courses without the repetitive manual steps typically required.

## Features

- **Automated Enrollment**: Automatically enroll in Udemy courses with a single click
- **Enrollment History**: Track your enrollment activities during your browsing session
- **Intuitive Dashboard**: Monitor enrollment progress and status
- **Privacy-Focused**: All data is stored locally and temporarily in your browser
- **Lightweight**: Minimal impact on browser performance

## Installation

### From Chrome Web Store

1. Visit the [Auto-Enroll Udemy Extension](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID) page on the Chrome Web Store
2. Click "Add to Chrome"
3. Confirm the installation when prompted

### Manual Installation (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `build` folder from this repository
5. The extension is now installed and ready to use

## How to Use

1. **Log in to Udemy**: Make sure you're logged into your Udemy account
2. **Browse Courses**: Navigate to any Udemy course page
3. **Auto-Enroll**: Click the extension icon in your browser toolbar to open the dashboard
4. **Enroll**: Click the "Enroll" button for the current course, or use batch enrollment for multiple courses
5. **Monitor Progress**: Track enrollment status through the extension dashboard

## Privacy

The Auto-Enroll Udemy Extension is designed with privacy as a priority:

- All data is stored locally in your browser using Chrome's storage API
- No personal information is transmitted to external servers
- Session data is automatically purged when you close your browser
- The extension only interacts with Udemy.com domains

For more details, please see our [Privacy Policy](docs/privacy-policy.html).

## Development

### Prerequisites

- Node.js version >= 18
- npm or yarn

### Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` for development mode with hot reloading
4. Load the extension from the `build` folder as described in the Manual Installation section

### Building for Production

```
npm run build
```

This will create a production-ready build in the `build` folder that can be submitted to the Chrome Web Store.

## Support

If you encounter any issues or have questions about the extension, please contact us:

- Email: <hiepnonh@gmail.com>
- Response Time: Within 24-48 hours
- Support Languages: English, Vietnamese

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 Auto-Enroll Udemy Extension. All rights reserved.
