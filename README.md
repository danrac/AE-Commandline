<img width="495" height="605" alt="AEcommandline" src="https://github.com/user-attachments/assets/4086b47d-787d-4b34-8abd-5917902634c9" />

# AE Command Line

A dockable command-line style scripting panel for Adobe After Effects built with ExtendScript + ScriptUI.

This tool brings a terminal-inspired workflow directly into After Effects, allowing users to rapidly prototype, execute, test, and iterate ExtendScript code from a persistent interactive scripting interface.

---

# Overview

AE Command Line is designed to function as a lightweight scripting console inside After Effects.

Instead of repeatedly opening `.jsx` files externally or manually running scripts through the standard scripting menu, users can:

* Write code directly inside the panel
* Execute scripts instantly
* Maintain persistent command history
* Recall previous commands using arrow navigation
* Store executed scripts automatically as individual `.jsx` files
* Iterate rapidly without leaving After Effects

The panel behaves similarly to a development terminal or REPL environment, but specifically adapted for the After Effects ExtendScript ecosystem.

---

# Features

## Interactive Script Execution

Execute ExtendScript commands directly from a multi-line editor inside After Effects.

Example:

```javascript
alert("Hello World");
```

or:

```javascript
var comp = app.project.items.addComp(
    "Test_Comp",
    1920,
    1080,
    1,
    5,
    30
);

comp.openInViewer();
```

---

## Persistent Command History

Every executed command is automatically:

* Saved as an individual `.jsx` file
* Indexed in a history database
* Recallable via:

  * Up Arrow
  * Down Arrow
  * History buttons

This allows users to revisit previous experiments, snippets, and utilities without manually managing script files.

---

## Automatic Script Archiving

Executed commands are stored locally as timestamped JSX files:

```text
cmd_20260521_031522_123.jsx
```

This effectively creates a lightweight script archive over time.

---

## Dockable ScriptUI Panel

The tool functions as a native dockable ScriptUI panel inside After Effects.

Once installed:

```text
Window → AE Command Line
```

The interface can be docked alongside standard After Effects panels.

---

## Undo Group Integration

Executed commands automatically run inside:

```javascript
app.beginUndoGroup()
```

allowing actions to be reverted cleanly through the normal undo system.

---

# Why This Exists

After Effects scripting workflows are traditionally fragmented:

* External code editor
* Save JSX file
* Return to AE
* Run script
* Debug
* Repeat

AE Command Line reduces this friction dramatically.

The goal is to create a faster, more exploratory scripting workflow directly inside After Effects.

This is especially useful for:

* Tool developers
* Technical artists
* Motion designers
* Pipeline TDs
* Rapid prototyping
* Expression testing
* API exploration
* Utility generation

---

# Installation

## macOS

Place the script here:

```text
/Applications/Adobe After Effects [VERSION]/Scripts/ScriptUI Panels/
```

## Windows

```text
C:\Program Files\Adobe\Adobe After Effects [VERSION]\Support Files\Scripts\ScriptUI Panels\
```

---

# Enable Scripting Permissions

Inside After Effects:

```text
Preferences → Scripting & Expressions
```

Enable:

```text
Allow Scripts To Write Files And Access Network
```

This is required because the panel stores command history and temporary script files locally.

---

# Launching

Inside After Effects:

```text
Window → AE Command Line
```

---

# Controls

| Control         | Function                 |
| --------------- | ------------------------ |
| Run Button      | Executes current code    |
| Ctrl + Enter    | Executes current code    |
| Up Arrow        | Previous command         |
| Down Arrow      | Next command             |
| Clear Button    | Clears editor            |
| History Buttons | Browse previous commands |

---

# File Storage

By default, history and temporary JSX files are stored in:

```javascript
Folder.temp
```

Example macOS path:

```text
/var/folders/.../T/AE_CommandLine_Temp/
```

Stored files include:

```text
history_index.txt
cmd_20260521_031522_123.jsx
cmd_20260521_031610_847.jsx
```

---

# Architecture

The system works by:

1. User enters code
2. Code is saved as a temporary JSX file
3. File path is stored in history
4. Script is executed using:

```javascript
$.evalFile()
```

5. Results/errors are logged to the output panel

This creates a modular execution workflow while preserving a permanent history trail.

---

# Future Roadmap

## Planned Features

### Macros

Predefined reusable scripting templates:

* Composition creation
* Layer generation
* Batch renaming
* Null setups
* Animation presets
* Expression builders

Users will be able to inject macro templates directly into the editor.

---

### Script Snippet Library

Save reusable commands into categorized collections.

Example:

```text
Animation
Project Cleanup
Expressions
Utilities
Rendering
```

---

### Auto-Completion

Potential future support for:

* AE API suggestions
* Property suggestions
* Layer references
* Built-in ExtendScript methods

---

### Session Persistence

Restore:

* Open commands
* Scroll position
* Previous editor state
* Last executed snippets

---

### External Script Monitoring

Watch folders for JSX changes and reload automatically.

---

### AI-Assisted Scripting

Potential integration with local or remote LLM systems for:

* Script generation
* Command suggestions
* API lookup
* Error correction
* Workflow automation

---

### Multi-Tab Editor

Support for multiple simultaneous command buffers.

---

### Syntax Highlighting

Custom ExtendScript syntax rendering inside ScriptUI.

---

### Logging System

Persistent debug logs with timestamps and execution metadata.

---

# Design Philosophy

AE Command Line is intended to feel closer to:

* A terminal
* A scripting shell
* A lightweight development environment

rather than a traditional After Effects utility panel.

The emphasis is on:

* Speed
* Iteration
* Experimentation
* Persistence
* Reduced scripting friction

---

# Compatibility

Tested with:

* Adobe After Effects
* Adobe After Effects

Should work with most modern ExtendScript-compatible versions of After Effects.

---

# Disclaimer

This tool executes arbitrary ExtendScript code directly inside After Effects.

Use responsibly.

Improper scripts may:

* Modify projects
* Delete items
* Cause instability
* Crash After Effects

Always save your project before executing unknown code.

---

# License

MIT License

---

# Contributions

Contributions, feature requests, and workflow ideas are welcome.

Particularly interested in:

* ExtendScript tooling workflows
* ScriptUI enhancements
* Terminal-style UX ideas
* Macro systems
* AE developer utilities
* AI-assisted scripting integrations
