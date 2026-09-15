# VCP application

This existing demo repository has been given the Vibe Coding Platform initialization files. This does not certify that repository provisioning ran through VCP.

Read **AGENTS.md** and **vcp.project.json** before starting development. Claude also reads
CLAUDE.md, which includes the shared rules. Keep project-specific business requirements in
a separate document; they do not authorize infrastructure changes.

## Start with any AI coding tool

Give the AI access to `AGENTS.md` and `vcp.project.json`, then send:

> Before coding, read AGENTS.md and vcp.project.json in full. Follow the first-action instructions
> to create your own project-local VCP skill or instruction file in your tool's supported format.
> Preserve all VCP restrictions and tell me how the file will load in future sessions. Anything
> outside the approved application infrastructure must be referred to the VCP team before implementation.

Repeat this when switching tools. For a chat-only AI, attach the files or paste their full content;
a filename alone does not give the model access. If the tool cannot load rules automatically,
attach its generated `VCP_SKILL.md` plus the current canonical files at each new session.

The initial profile supports a TypeScript/Next.js application on Node.js 24 with PostgreSQL 17.
This is a policy starter, not a generated application or a provisioned database. VCP must configure
the runtime, dependencies, authentication, migrations, environment secrets and health checks
before deployment. Contact the VCP team for capabilities outside the profile.

Create new repositories and deploy applications through VCP.

## Daylist demo

See [demo run instructions](docs/demo.md) for the existing application and
[project initialization](docs/project-initialization.md) for the platform workflow.
The exact upstream template is retained in [templates/nextjs-postgresql](templates/nextjs-postgresql).
Root `AGENTS.md`, `CLAUDE.md`, and `vcp.project.json` match that template.

### Current implementation status

The demo currently uses browser-local task storage and plain CSS. It has no PostgreSQL/pg
integration, Tailwind setup, or application authentication. Installing these policy files
does not implement those capabilities or certify profile compliance. The unchanged profile
retains `provisioningStatus: requires-vcp-setup`; VCP must resolve these gaps before treating
the application as a provisioned instance of the profile. No infrastructure approval is implied.

### Codex activation

The project-local adapter is [.agents/skills/vcp-project/SKILL.md](.agents/skills/vcp-project/SKILL.md).
It includes the complete policy/profile and requires refreshing those copies when their sources change.
Start Codex in this repository so root `AGENTS.md` is its instruction entry point; explicitly
invoke `$vcp-project` at the start of each session if it has not loaded. From a parent workspace
or chat-only tool, attach the skill and both canonical files manually. Fresh-session automatic
loading has not been tested.

See the official [AGENTS.md instructions](https://developers.openai.com/codex/guides/agents-md/)
and [skill guidance](https://developers.openai.com/codex/skills/).
