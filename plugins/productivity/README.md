# Productivity Toolkit

Streamlined workflow orchestration commands for planning and parallel task execution in Claude Code, plus Google Apps Script automation for Workspace.

## What's Included

### Commands (4)

- **/planning** - Structured planning workflows for feature development
- **/prep-parallel** - Prepare tasks for parallel execution
- **/execute-parallel** - Execute prepared tasks in parallel
- **/primer** - Quick project initialisation and context gathering

### Skills (2)

- **google-apps-script** - Google Apps Script expertise for Workspace automation (Sheets, Docs, Gmail, Drive, Calendar, Forms, Slides)
- **tampermonkey** - Tampermonkey userscript development for browser automation, page modification, and web enhancement

## Installation

```bash
/plugin install productivity@wookstar
```

## Usage Examples

### Workflow Commands

```bash
# Plan a complex feature with structured workflow
/planning "Design a real-time notification system"

# Prepare multiple tasks for parallel execution
/prep-parallel "tasks.md"

# Execute the prepared parallel tasks
/execute-parallel

# Quick project primer to understand codebase
/primer
```

### Google Apps Script

```bash
# Sheets automation
"Create a custom function to calculate tax in Google Sheets"

# Gmail automation
"Build an auto-responder script for Gmail"

# Document generation
"Generate personalized contracts from a Sheets template"

# Workflow automation
"Create a script to sync Calendar events with Sheets"
```

### Tampermonkey

```bash
# Page modification
"Write a userscript to add a dark mode toggle to example.com"

# Element hiding
"Create a script to hide annoying popups on news sites"

# Form automation
"Build a userscript that auto-fills login forms"

# Data extraction
"Write a script to extract product prices from a shopping site"

# SPA enhancements
"Create a userscript that adds keyboard shortcuts to a React app"
```

## Command Details

### /planning

Structured planning workflow that guides you through feature development with organised phases:

- Problem definition and scope
- Technical requirements analysis
- Implementation approach
- Task breakdown and prioritisation

### /prep-parallel

Prepares tasks for parallel execution by:

- Parsing task specifications from a file
- Analysing dependencies between tasks
- Organising tasks into executable batches
- Generating execution plan

### /execute-parallel

Executes prepared tasks in parallel:

- Runs independent tasks concurrently
- Manages task dependencies
- Aggregates results from all tasks
- Handles errors gracefully

### /primer

Quick project initialisation command that:

- Scans project structure
- Identifies key files and patterns
- Gathers context about the codebase
- Prepares for efficient development work

## Skill Details

### google-apps-script

Google Apps Script expertise for Workspace automation:

**Supported Services:**
- Google Sheets - custom functions, data manipulation, automation
- Google Docs - document creation, formatting, mail merge
- Gmail - email automation, filters, auto-responders
- Google Drive - file management, permissions, organisation
- Google Calendar - event management, scheduling, sync
- Google Forms - response handling, notifications
- Google Slides - presentation generation

**Capabilities:**
- Custom function development
- Trigger-based automation (time-based, form submission, etc.)
- Web app deployment
- Add-on development
- External API integration
- Workspace add-ons

### tampermonkey

Tampermonkey userscript development for browser automation and web enhancement:

**Use Cases:**
- Browser scripts for page modification
- Hiding unwanted elements (ads, popups, banners)
- Form auto-fill and automation
- Data extraction and scraping
- Adding custom functionality to websites
- SPA enhancements (URL change detection, keyboard shortcuts)
- Cross-origin API requests from browser

**Capabilities:**
- Complete userscript header syntax (@match, @grant, @require, @run-at)
- GM_* API functions (storage, HTTP requests, styles, notifications)
- Common patterns (element waiting, mutation observers, URL detection)
- Security best practices and sandboxing
- Cross-browser compatibility (Chrome, Firefox, Edge)
- 18 reference guides for deep API documentation

## When to Use

This toolkit is ideal for:

- Planning complex features with multiple components
- Breaking down large projects into parallel workstreams
- Executing multiple independent tasks efficiently
- Quickly getting oriented in a new codebase
- Orchestrating development workflows
- Automating Google Workspace tasks
- Building custom Sheets functions
- Creating email and document automation
- Writing browser userscripts for page modification
- Automating repetitive browser tasks
- Enhancing websites with custom functionality
