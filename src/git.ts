import child_process from 'child_process';


const checkIfTagExists = (version: string): boolean => {

  var gitTagOutcome = child_process.execSync(`git tag --list ${version}`);
  console.log(gitTagOutcome.toString());

  if (gitTagOutcome && gitTagOutcome.toString()) {
    console.log('tag')

    return true;
  }

  return false;
};


export default checkIfTagExists;


