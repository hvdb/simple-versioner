import fs from 'fs';
import path from 'path';
import tagExists from './git';

const simpleVersioner = (): string => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')).toString());

  // Create version based on Azure system variable
  const version = createVersion(packageJson);

  // Check if version is already released (tag exists)
  if (tagExists(version)) {
    console.log('tsag ')
    console.log('##vso[task.complete result=Failed;]DONE');
    // Exit with a non success code as we should not release.
    throw new Error(`Version ${version} is already released, please update package.json to a newer version`);
  }
  console.log('hjhjhjh')
  // Update the package.json with the new version
  updatePackageJson(version, packageJson);
  // Update Azure devops BuildNumber with the new version.
  updateBuildnumberOnAzure(version);
  return version;
};

const createVersion = (packageJson: any): string => {
  // Get all the needed data
  const buildReason: string = process.env.BUILD_REASON || '';
  let sourceBranch: string = process.env.BUILD_SOURCEBRANCH || '';
  let gitCommitHash: string = process.env.BUILD_SOURCEVERSION || '';

  if (buildReason === 'PullRequest') {
    sourceBranch = process.env.SYSTEM_PULLREQUEST_SOURCEBRANCH || sourceBranch;
    gitCommitHash = process.env.SYSTEM_PULLREQUEST_SOURCECOMMITID || gitCommitHash;
  }

  const gitSha = gitCommitHash.slice(0, 8);
  let correctVersion = packageJson.version;
  // if master use defined version.
  // otherwise create one based on branch and sha
  if (sourceBranch !== 'refs/heads/master') {
    let correctedSourceBranch = sourceBranch.replace(/\//g, "-");
    correctVersion = `${packageJson.version}-${correctedSourceBranch}-${gitSha}`
  }

  return correctVersion;
}

const updatePackageJson = (version: string, packageJson: any): void => {
  packageJson.version = version;
  fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, 4));
}

const updateBuildnumberOnAzure = (version: string): void => {
  // log to output so that azure can use it
  console.log(`##vso[build.updatebuildnumber]${version}`);
}

export default simpleVersioner;


