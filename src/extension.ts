import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

// Resolve the `glide` executable.
//   1. An explicit `glide.path` setting always wins.
//   2. Otherwise prefer the standard install location (~/.glide/bin), because
//      VS Code is a GUI app and on Windows it does NOT inherit the shell PATH —
//      so `glide` installed into ~/.glide/bin wouldn't be found by name even
//      though it works in a terminal. (This was the "where's the LSP?" bug: the
//      server command wasn't resolvable, so the server silently never started.)
//   3. Fall back to `glide` on PATH.
function resolveGlide(): string {
    const configured = vscode.workspace.getConfiguration("glide").get<string>("path") || "glide";
    if (configured !== "glide") return configured;
    const exe = process.platform === "win32" ? "glide.exe" : "glide";
    const installed = path.join(os.homedir(), ".glide", "bin", exe);
    if (fs.existsSync(installed)) return installed;
    return "glide";
}

export function activate(context: vscode.ExtensionContext) {
    const command = resolveGlide();

    const serverOptions: ServerOptions = {
        run:   { command, args: ["lsp"], transport: TransportKind.stdio },
        debug: { command, args: ["lsp"], transport: TransportKind.stdio },
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "glide" }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher("**/*.glide"),
        },
        traceOutputChannel: vscode.window.createOutputChannel("Glide LSP"),
    };

    client = new LanguageClient(
        "glide",
        "Glide Language Server",
        serverOptions,
        clientOptions,
    );

    client.start().catch((err) => {
        vscode.window.showErrorMessage(
            `Glide LSP failed to start (tried \`${command}\`). ` +
            `Install Glide, or set "glide.path" to your glide binary. Details: ${err}`,
        );
    });

    context.subscriptions.push({
        dispose: () => { void client?.stop(); },
    });
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}
