# Installation Guide

## Prerequisites

- Node.js 18+
- Claude Code CLI

## Quick Install

```bash
# Clone the repository
git clone https://github.com/resmark/verbalized-sampling.git
cd verbalized-sampling

# Install and build
cd mcp-server
npm install
npm run build
cd ..
```

## Configure Claude Code

Add the MCP server to your Claude Code configuration:

### Option 1: Project-level (recommended)

Create or edit `.claude/mcp.json` in your project:

```json
{
  "mcpServers": {
    "verbalized-sampling": {
      "command": "node",
      "args": ["/absolute/path/to/verbalized-sampling/mcp-server/dist/index.js"]
    }
  }
}
```

### Option 2: User-level (global)

Edit `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "verbalized-sampling": {
      "command": "node",
      "args": ["/absolute/path/to/verbalized-sampling/mcp-server/dist/index.js"]
    }
  }
}
```

## Install Slash Commands

Copy the commands to your Claude Code commands directory:

```bash
# Project-level
mkdir -p .claude/commands
cp -r /path/to/verbalized-sampling/commands/* .claude/commands/

# Or user-level
cp -r /path/to/verbalized-sampling/commands/* ~/.claude/commands/
```

## Verify Installation

1. Start Claude Code in your project
2. Try a slash command:
   ```
   /vs:explore What are different ways to implement caching?
   ```
3. Or use the MCP tool directly:
   ```
   Use mcp__verbalized-sampling__vs_generate with prompt "test"
   ```

## Troubleshooting

### "MCP server not found"
- Verify the path in your mcp.json is absolute and correct
- Ensure the server is built: `cd mcp-server && npm run build`
- Check Node.js version: `node --version` (needs 18+)

### "Command not found"
- Ensure commands are in `.claude/commands/` or `~/.claude/commands/`
- Restart Claude Code after adding commands

### Server errors
- Check logs: The server outputs to stderr
- Run manually to test: `node mcp-server/dist/index.js`
