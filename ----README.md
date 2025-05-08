# Pixel & Flow

A modern creative SaaS app built to be the most responsive, lowest latency, & best UX experience in the world. World class UI, responsive & interactive micro animations, and more.

## Features

 - 🚀 Built with Next.js 15.3.2 and App Router (https://nextjs.org/) 
- 🚀 AnyCable **Backbone for our modern SaaS platform** supporting real-time updates for images, API requests, team dashboards, notifications, and user presence with low latency and high scalability for fluid UX at high user volume. (https://docs.anycable.io/) (Node.js Repo: https://github.com/premvystudio/anycable)
- 🚀 React 19.1.0 Powers our component-based UI architecture with efficient rendering and state management. (https://react.dev/)
- ❤️ Framer Motion 11.0.8 Powers our declarative animations with React integration for complex UI transitions. (https://www.framer.com/motion/)
- ❤️ Motion One 0.20.0 Handles performance-critical animations using the Web Animations API for smooth 60fps experiences. (https://motion.dev/) 
- 📊 Web hosting with Vercel (https://vercel.com) 
- 🖼️ File storage with Vercel Blob (https://vercel.com/docs/storage/vercel-blob)
- 🔒 Authentication with Clerk (https://clerk.dev/)


# Core Dependencies

This document provides a concise list of all core dependencies used in the Creative SaaS Platform, with ultra-simple descriptions of their role in our stack and links to the most relevant documentation.

## Core Infrastructure

| Dependency | Version | Role in Our Stack | Documentation Link |
|------------|---------|-------------------|-------------------|
| Next.js | 15.3.2 | Our primary framework for building server-rendered React applications with optimal performance. | [Documentation](https://nextjs.org/docs) |
| React | 19.1.0 | Powers our component-based UI architecture with efficient rendering and state management. | [Documentation](https://react.dev/) |
| TypeScript | 5.8.3 | Ensures type safety across our codebase, reducing runtime errors and improving developer experience. | [Documentation](https://www.typescriptlang.org/docs/) |
| Clerk | 6.19.1 | Handles all user authentication, authorization, and profile management with minimal configuration. | [Documentation](https://clerk.com/docs) |
| AnyCable | 1.1.0 | **Backbone for our modern SaaS platform** supporting real-time updates for images, API requests, team dashboards, notifications, and user presence with low latency and high scalability for fluid UX at high user volume. | [Documentation](https://docs.anycable.io/) [Client](https://github.com/anycable/anycable-client) [Serverless](https://docs.anycable.io/guides/serverless) |
| Vercel Blob | 1.0.1 | Manages all file storage needs with automatic CDN distribution and metadata support. | [Documentation](https://vercel.com/docs/storage/vercel-blob) |
| Vercel | N/A | Provides our deployment infrastructure with edge computing, analytics, and global CDN. | [Documentation](https://vercel.com/docs) |

## Animation Framework

| Dependency | Version | Role in Our Stack | Documentation Link |
|------------|---------|-------------------|-------------------|
| Framer Motion | 11.0.8 | Powers our declarative animations with React integration for complex UI transitions. | [Documentation](https://www.framer.com/motion/) |
| Motion One | 0.20.0 | Handles performance-critical animations using the Web Animations API for smooth 60fps experiences. | [Documentation](https://motion.dev/) |
| @motionone/dom | 10.17.0 | Provides DOM-specific animation utilities for our most demanding animation sequences. | [Documentation](https://motion.dev/dom/getting-started) |
| @motionone/utils | 10.17.0 | Supplies helper functions for animation timing, easing, and transformation. | [Documentation](https://motion.dev/guides/packages) |

## UI & Styling

| Dependency | Version | Role in Our Stack | Documentation Link |
|------------|---------|-------------------|-------------------|
| TailwindCSS | 4.1.5 | Forms the foundation of our styling system with utility-first approach for rapid UI development. | [Documentation](https://tailwindcss.com/docs) |
| tailwindcss-animate | 1.0.7 | Extends Tailwind with animation utilities that integrate with our animation framework. | [Documentation](https://github.com/jamiebuilds/tailwindcss-animate) |
| class-variance-authority | 0.7.1 | Creates type-safe UI component variants with consistent styling across the platform. | [Documentation](https://cva.style/docs) |
| clsx | 2.1.1 | Simplifies conditional class name construction for dynamic styling needs. | [Documentation](https://github.com/lukeed/clsx) |
| tailwind-merge | 3.2.0 | Resolves Tailwind class conflicts when combining multiple class sets. | [Documentation](https://github.com/dcastil/tailwind-merge) |

## AI Integration

| Dependency | Version | Role in Our Stack | Documentation Link |
|------------|---------|-------------------|-------------------|
| OpenAI | 4.97.0 | Connects our platform to OpenAI's services with optimized request handling and response processing. | [Documentation](https://platform.openai.com/docs/api-reference) |
| OpenAI GPT-4o Image API 'gpt-image-1' | N/A | Powers our AI image generation features with state-of-the-art quality and customization. | [Documentation](https://platform.openai.com/docs/guides/images) |

## Form & Validation

| Dependency | Version | Role in Our Stack | Documentation Link |
|------------|---------|-------------------|-------------------|
| react-hook-form | 7.56.3 | Manages all form state and validation with minimal re-renders for optimal performance. | [Documentation](https://react-hook-form.com/) |
| @hookform/resolvers | 5.0.1 | Connects our schema validation to react-hook-form with seamless integration. | [Documentation](https://github.com/react-hook-form/resolvers) |
| zod | 3.24.4 | Handles all data validation with TypeScript integration for end-to-end type safety. | [Documentation](https://zod.dev/) |

## State Management

| Dependency | Version | Role in Our Stack | Documentation Link |
|------------|---------|-------------------|-------------------|
| zustand | 4.5.2 | Manages client-side application state with minimal boilerplate and optimal performance. | [Documentation](https://github.com/pmndrs/zustand) |

## Development Tools

| Dependency | Version | Role in Our Stack | Documentation Link |
|------------|---------|-------------------|-------------------|
| ESLint | 9.26.0 | Enforces code quality standards and catches potential issues during development. | [Documentation](https://eslint.org/docs/latest/) |
| PostCSS | 8.5.3 | Processes our CSS with modern features and optimizations for production. | [Documentation](https://postcss.org/) |
| Autoprefixer | 10.4.21 | Automatically adds vendor prefixes to CSS for cross-browser compatibility. | [Documentation](https://github.com/postcss/autoprefixer) |
