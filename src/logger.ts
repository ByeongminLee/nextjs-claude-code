import pc from 'picocolors';

export const log = {
  success: (msg: string) => console.log(pc.green('✓') + ' ' + msg),
  info:    (msg: string) => console.log(pc.cyan('›') + ' ' + msg),
  warn:    (msg: string) => console.log(pc.yellow('!') + ' ' + msg),
  error:   (msg: string) => console.error(pc.red('✗') + ' ' + msg),
  blank:   ()            => console.log(),
};

// 한 줄을 덮어쓰며 진행 상태를 표시하는 progress 헬퍼
export const progress = {
  update(msg: string): void {
    process.stdout.write(`\r\x1b[K${pc.cyan('›')} ${msg}`);
  },
  succeed(msg: string): void {
    process.stdout.write(`\r\x1b[K${pc.green('✓')} ${msg}\n`);
  },
  fail(msg: string): void {
    process.stdout.write(`\r\x1b[K${pc.red('✗')} ${msg}\n`);
  },
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
