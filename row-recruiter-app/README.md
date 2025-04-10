# RowRecruiter

A modern platform connecting high school rowers with college rowing programs. RowRecruiter simplifies the college rowing recruitment process for athletes, coaches, and parents.

## Features

### For Athletes
- Create comprehensive athlete profiles
- Track and showcase performance metrics (2k, 6k times)
- Upload training and race videos
- Express interest in college programs
- Track application status with different schools

### For Coaches
- Access a database of potential recruits
- Filter and search athletes by key metrics
- Track interested athletes
- Manage recruitment pipeline

### For Parents (Premium Features)
- AI-powered email outreach assistance
- Personalized workout planning
- Video analysis and feedback
- Recruitment strategy consulting

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI Features**: OpenAI API
- **Payments**: Stripe
- **Email**: Custom email service

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account
- OpenAI API key (for AI features)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rowrecruiter.git
cd rowrecruiter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then fill in your environment variables in `.env.local`

4. Set up the database:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
rowrecruiter-app/
├── src/
│   ├── app/                    # Main application routes and layouts
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── (marketing)/       # Public marketing pages
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility functions and configurations
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)
Project Link: [https://github.com/yourusername/rowrecruiter](https://github.com/yourusername/rowrecruiter)
