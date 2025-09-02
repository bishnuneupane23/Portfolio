# Portfolio Website for QA Lead

## Overview

This is a portfolio website for Bishnu Prasad Neupane, a Quality Assurance Lead at ankaEK. The website showcases professional experience, skills, and project case studies in the QA field. Built as a modern single-page application with React, it features sections for hero introduction, about, skills proficiency matrix, project showcase with detailed case studies, resume, and contact information. The site emphasizes QA expertise in manual testing, automation, and API testing tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Single-page application built with React and TypeScript using Vite as the build tool
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **State Management**: React Query (@tanstack/react-query) for server state management with minimal local state
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Theme System**: Dark mode by default with theme switching capability using React Context

### Component Organization
- **Component Structure**: Modular component architecture with UI components separated from business logic
- **Design System**: shadcn/ui provides pre-built accessible components (buttons, cards, dialogs, forms)
- **Responsive Design**: Mobile-first approach with responsive breakpoints and mobile navigation
- **Page Structure**: Component-based sections (Hero, About, Skills, Projects, Resume, Contact) composed into pages

### Development Setup
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Full TypeScript integration with strict type checking
- **Path Aliases**: Configured aliases (@/ for client/src, @shared/ for shared) for clean imports
- **Hot Module Replacement**: Development server with HMR for rapid iteration

### Backend Architecture
- **Express Server**: Node.js Express server with TypeScript
- **Development Mode**: Vite middleware integration for seamless full-stack development
- **API Structure**: RESTful API design with /api prefix (currently minimal, ready for expansion)
- **Error Handling**: Centralized error handling middleware
- **Storage Interface**: Abstracted storage interface (currently in-memory, designed for easy database integration)

### Data Storage Design
- **Drizzle ORM**: Database ORM configured for PostgreSQL with schema-first approach
- **Schema Definition**: Shared schema types between client and server using Zod validation
- **Migration Support**: Database migration system configured with drizzle-kit
- **Environment Configuration**: Database connection via environment variables

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible headless components for complex UI patterns (dialogs, dropdowns, navigation)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant system for component styling

### Development Tools
- **Vite**: Modern build tool with plugins for React and runtime error handling
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

### Database and ORM
- **Neon Database**: PostgreSQL-compatible serverless database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect
- **Database Session Management**: PostgreSQL session store (connect-pg-simple) for production

### Form Handling and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod Resolvers**: Type-safe form validation using Zod schemas
- **Drizzle-Zod**: Integration between Drizzle schemas and Zod validation

### External Services
- **Calendly Integration**: External booking system for interview scheduling
- **Email Integration**: Mailto links for direct communication
- **Font Services**: Google Fonts integration for typography (Inter, custom fonts)

### Replit-Specific
- **Replit Plugins**: Development banner and cartographer for Replit environment
- **Runtime Error Overlay**: Enhanced error reporting in development mode