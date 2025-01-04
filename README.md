# Crypto Wallet 🏦

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)

## ✨ Demo

![Demo GIF](https://miniostorage.kleankreative.com/api/v1/buckets/typebot/objects/download?preview=true&prefix=dashboard.gif)

A modern and secure digital wallet to manage your digital assets.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/elvisbrazil/crypto-wallet.git

# Navigate to the directory
cd crypto-wallet

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Add your API keys in .env.local
NEXT_PUBLIC_COINGECKO_API_KEY=
NEXT_PUBLIC_ETHERSCAN_API_KEY=

# To get a key from CoinGecko, visit https://www.coingecko.com/en/api/documentation
# To get a key from Etherscan, visit https://etherscan.io/apis

# Start the development server
npm run dev
```

## 🏗️ Project Structure

```
crypto-wallet/
├── app/                # Main Next.js 13 directory
├── components/         # Reusable components
│   ├── ui/            # UI components
│   ├── monthly-stats/ # Analytics components
│   └── wallet/        # Wallet-specific components
├── lib/               # Utility functions
├── public/           # Static assets
└── styles/          # Global styles
```

## 🛡️ Security Features

- ✅ Transaction signing
- ✅ Encrypted storage
- ✅ Implementation of security best practices

## 📊 Main Components

### Wallet Dashboard
- 💰 Balance overview
- 📝 Transaction history
- 📈 Asset distribution
- 📊 Performance metrics

### Monthly Stats
- 📊 Bar chart visualization
- ⚡ Real-time updates
- 🔍 Interactive tooltips
- 📱 Responsive design

## 🔄 Integrations

- 💱 Real-time price feeds
- 🌐 Transaction broadcasting
- 💼 Balance checking
- 📡 Network status monitoring

## 🎨 Customization

The project uses:
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email elvisgoncalves@outlook.com

## 🙏 Acknowledgments

- Next.js Team
- Noble Curves Contributors
- Recharts Team

---
Made with ❤️ by Elvis Gonçalves

