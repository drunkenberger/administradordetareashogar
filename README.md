# Planificador de Tareas del Hogar

## Overview
A comprehensive weekly home task planner application built with React, TypeScript, and modern web technologies. This app helps families organize and manage household chores with an intuitive drag-and-drop calendar interface.

## ✨ Features

### 📅 Calendar Views
- **Week View**: See all tasks across 5-7 days
- **Day View**: Focus on a single day with detailed scheduling
- **Weekend Toggle**: Show/hide weekend days

### 🏠 Task Management
- **173+ Pre-defined Tasks**: Comprehensive catalog of household chores
- **Drag & Drop**: Move tasks between days and time slots
- **Resize**: Adjust task duration by dragging handles
- **Quick Add**: Add tasks from template catalog
- **Custom Tasks**: Create your own tasks with detailed forms

### 👥 Assignment & Organization
- **Multiple Assignees**: ayudante, esposa, esposo, compartido
- **Categories**: daily, weekly, monthly, eventual, urgent
- **Color Coding**: Visual distinction by category
- **Conflict Detection**: Automatic overlap detection and warnings

### 💾 Data Management
- **Local Storage**: Automatic saving in browser
- **Import/Export**: JSON file backup and restore
- **Template Library**: Quick insertion of daily task sets

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm run test` - Run unit tests

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui component library
│   ├── ChoreBlock/      # Draggable task blocks
│   ├── ChoreForm/       # Task creation/editing forms
│   ├── QuickAdd/        # Quick template-based adding
│   └── WeekNav/         # Week navigation controls
├── views/               # Main view components
│   ├── WeekView/        # Weekly calendar view
│   └── DayView/         # Single day view
├── utils/               # Utility functions
│   ├── time.ts          # Time manipulation
│   ├── dates.ts         # Date utilities
│   ├── conflicts.ts     # Conflict detection
│   └── labels.ts        # Label formatting
├── data/                # Data and templates
│   ├── choreTemplates.ts # 173 predefined tasks
│   └── defaultChores.ts  # Default task seeds
├── hooks/               # Custom React hooks
├── services/            # Business logic
├── types/               # TypeScript definitions
└── constants/           # App constants
```

## 🎯 Usage

### Adding Tasks
1. **Quick Add**: Select from 173+ predefined tasks in the header dropdown
2. **Custom Add**: Use the "Agregar tarea" button for custom tasks
3. **Template Insert**: Use "Insertar plantilla diaria" for common daily tasks

### Managing Tasks
- **Move**: Drag tasks between days and time slots
- **Resize**: Drag the bottom handle to adjust duration
- **Edit**: Click on any task to open the edit dialog
- **Delete**: Use the delete button in the edit dialog

### Views & Navigation
- **Week/Day Toggle**: Switch between weekly and daily views
- **Weekend Toggle**: Show/hide Saturday and Sunday
- **Week Navigation**: Use arrows to navigate between weeks
- **Filters**: Filter by category or assignee

### Data Management
- **Auto-save**: All changes saved automatically to browser storage
- **Export**: Download your tasks as JSON backup
- **Import**: Restore from JSON backup file
- **Clear**: Reset all tasks (with confirmation)

## 🏗️ Architecture

### Design Principles
- **Modular**: Each file under 200 lines following CLAUDE.md rules
- **Separation of Concerns**: Clear boundaries between UI, logic, and data
- **Type Safety**: Full TypeScript coverage
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized rendering with useMemo and useCallback

### Key Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library

## 🧪 Testing

The app includes comprehensive test utilities:

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

Test coverage includes:
- Time calculation utilities
- Conflict detection algorithms
- Date manipulation functions
- Task seeding and generation

## 📱 Browser Support

- Modern Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App capabilities

## 🔄 Migration from Original

This refactored version replaces the original monolithic 1355-line file with:
- **25+ focused modules** (each <200 lines)
- **Improved maintainability** and testability
- **Better performance** through code splitting
- **Enhanced developer experience** with TypeScript

**⚠️ Keep the original file until you've tested the new version thoroughly.**

## 📝 Contributing

1. Follow the CLAUDE.md development rules
2. Keep modules under 200 lines
3. Add tests for new utilities
4. Update ELEMENT_IDS.md for new UI elements
5. Document changes in CHANGE_LOG.md

## 📄 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ for organized families**