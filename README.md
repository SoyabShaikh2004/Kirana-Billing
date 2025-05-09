# Malik Kirana Shop Billing Application

A frontend-only Next.js application designed for shop owners to create and manage bills efficiently.

## Features

- **Item Entry Form:** Add items to bills with name, price, and quantity
- **Auto Bill Calculation:** Automatic calculation of item totals and grand total
- **Unique Bill Number Generation:** Automatically generates unique bill numbers for each new bill
- **Date Selection:** Choose billing date through a user-friendly date picker
- **Bill Display:** Clear, organized display of the current bill with all details
- **Print/Download:** Simulated functionality to print or download bills as PDFs
- **Search Past Bills:** Look up previous bills by number, customer name, or date (simulated with sample data)
- **Responsive Design:** Layout adapts well to different screen sizes
- **WhatsApp/SMS Sharing:** Simulated functionality to share bills via messaging platforms

## Tech Stack

- **Next.js** for the frontend framework
- **TypeScript** for type-safe code
- **Tailwind CSS** for styling
- **React Hooks** for state management
- **React DatePicker** for the date selection component
- **React Icons** for UI icons

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/malik-kirana.git
cd malik-kirana
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Notes

This is a frontend-only implementation, with simulated data persistence. In a production environment, you would want to:

- Connect to a backend server for data persistence
- Add user authentication for security
- Implement proper error handling
- Add comprehensive testing
- Enhance the print functionality to generate proper PDF documents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
