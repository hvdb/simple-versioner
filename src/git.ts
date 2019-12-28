import child_process from 'child_process';

/**
 * 
 * Check if there is a tag for the given version
 * 
 * @param version version to check
 */
const checkIfTagExists = (version: string): boolean => {
  const gitTagOutcome = child_process.execSync(`git tag --list ${version}`);
  if (gitTagOutcome && gitTagOutcome.toString()) {
    return true;
  }
  return false;
};

export default checkIfTagExists;