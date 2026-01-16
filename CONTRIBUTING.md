# Contributing to Genesis Protocol

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Genesis-Protocol.git
   cd Genesis-Protocol
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

1. **Make your changes** in your feature branch
2. **Test locally**:
   ```bash
   npm run start
   ```
3. **Build to verify**:
   ```bash
   npm run build
   ```
4. **Commit with meaningful messages**:
   ```bash
   git commit -m "Add: feature description"
   git commit -m "Fix: bug description"
   git commit -m "Refactor: code improvement description"
   ```

## Commit Message Guidelines

- Use imperative mood ("add feature" not "added feature")
- First line: 50 characters or less
- Reference issues when applicable: "Fixes #123"
- Examples:
  - `Add: adaptive difficulty algorithm for reasoning test`
  - `Fix: focus growth calculation in creative protocol`
  - `Refactor: extract TerminalShell component logic`

## Pull Request Process

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Create a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what and why
   - Screenshots for UI changes
   - References to related issues
   - Checklist of changes

3. **PR Checklist**:
   - [ ] Code follows project style
   - [ ] TypeScript types are correct
   - [ ] No console errors/warnings
   - [ ] Tested locally
   - [ ] Documentation updated if needed

## Code Style

- **TypeScript**: Use strict type checking
- **React**: Functional components with hooks
- **Naming**: 
  - Components: PascalCase (e.g., `OnboardingPage`)
  - Functions: camelCase (e.g., `handleAnswer`)
  - Constants: UPPER_SNAKE_CASE (e.g., `TOTAL_ROUNDS`)
- **Files**: Use .tsx for React components, .ts for utilities
- **Formatting**: Prettier (configured via Tailwind)

## Testing

- Test adaptive algorithms thoroughly
- Verify on mobile and desktop
- Check accessibility (keyboard navigation, screen readers)
- Test all assessment flows

## Areas for Contribution

### High Priority
- [ ] Performance optimization
- [ ] Mobile responsiveness improvements
- [ ] Accessibility enhancements
- [ ] Bug fixes

### Medium Priority
- [ ] New assessment types
- [ ] Enhanced analytics
- [ ] Improved UI/UX
- [ ] Documentation

### Welcome Contributions
- Bug reports with reproduction steps
- Feature suggestions with use cases
- Documentation improvements
- Translation support

## Questions?

- Open an issue for bugs
- Start a discussion for features
- Check existing issues first

Thank you for contributing! 🎉
