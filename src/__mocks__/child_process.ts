const child_process = jest.genMockFromModule('child_process');

// 1) mock that prettier is installed
// 2) mock prettier commands to return something...
function execSync(command: string) {
  if (command.startsWith('npm ls')) {
    return Buffer.from('Is installed...');
  }
  if (command.startsWith('npx prettier')) {
    return Buffer.from('We formatted!!');
  }
  return Buffer.from('');
}

// If anyone knows how to avoid the type assertion feel free to edit this answer
(child_process as any).execSync = execSync;

module.exports = child_process;