# Malik Kirana Shop Billing Application

## 🌐 Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
├── src/
│   ├── app/                       # Next.js app directory (entry, layout, pages)
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main page (bill UI)
│   │   └── globals.css            # Global styles (Tailwind)
│   ├── components/                # React components
│   │   ├── BillActions.tsx        # Bill actions (PDF, WhatsApp)
│   │   ├── BillDisplay.tsx        # Bill display table
│   │   ├── ItemEntryForm.tsx      # Item entry form
│   │   └── PaymentQRCode.tsx      # UPI QR code generator
│   ├── types/                     # TypeScript types
│   │   └── index.ts
│   └── utils/                     # Utility functions
│       └── billUtils.ts
├── public/                        # Static assets (logo, favicon)
│   ├── Logo.jpg
│   └── favicon.ico
├── package.json                   # Project metadata & scripts
├── tsconfig.json                  # TypeScript config
├── next.config.mjs                # Next.js config
├── postcss.config.mjs             # PostCSS config
├── eslint.config.mjs              # ESLint config
├── vercel.json                    # Vercel deployment config
└── LICENSE                        # MIT License
```

## 🔧 Technologies & Stack

### Primary Stack
- Next.js (React, App Router, SSR)
- TypeScript
- Tailwind CSS
- React Icons, React DatePicker, jsPDF, QRCode.react

### Development Tools
- PostCSS, Node.js, npm, ESLint

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
