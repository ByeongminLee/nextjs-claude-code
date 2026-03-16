import pc from 'picocolors';

export const log = {
  success: (msg: string) => console.log(pc.green('✓') + ' ' + msg),
  info:    (msg: string) => console.log(pc.cyan('›') + ' ' + msg),
  warn:    (msg: string) => console.log(pc.yellow('!') + ' ' + msg),
  error:   (msg: string) => console.error(pc.red('✗') + ' ' + msg),
  step:    (msg: string) => console.log(pc.dim('  ' + msg)),
  blank:   ()            => console.log(),
};

export function banner(version: string): void {
  console.log();
  console.log(pc.bold(pc.cyan('  ███╗   ██╗ ██████╗ ██████╗')));
  console.log(pc.bold(pc.cyan('  ████╗  ██║██╔════╝██╔════╝')));
  console.log(pc.bold(pc.cyan('  ██╔██╗ ██║██║     ██║     ')));
  console.log(pc.bold(pc.cyan('  ██║╚██╗██║██║     ██║     ')));
  console.log(pc.bold(pc.cyan('  ██║ ╚████║╚██████╗╚██████╗')));
  console.log(pc.bold(pc.cyan('  ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝')));
  console.log();
  console.log(pc.bold('  NCC') + pc.dim(` — nextjs-claude-code v${version}`));
  console.log(pc.dim('  Spec-Driven AI workflow for Next.js & React'));
  console.log();
}
