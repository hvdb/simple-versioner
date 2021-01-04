import fs from 'fs';
import path from 'path';
import tagExists from './git';

const simpleVersioner = (): string => {
  let jsonFilePath;
  if(process.argv.length > 2) {
    jsonFilePath = path.join(process.cwd(), process.argv[2])
  } else {
    jsonFilePath = path.join(process.cwd(), 'package.json');
  }
  
  const jsonFile = JSON.parse(fs.readFileSync(jsonFilePath).toString());

  // Create version based on Azure system variable
  const version = createVersion(jsonFile);

  // Check if version is already released (tag exists)
  if (tagExists(version)) {
    // Exit with a non success code as we should not release.
    throw new Error(`Version ${version} is already released, please update package.json to a newer version`);
  }
  // Update the package.json with the new version
  updateJson(version, jsonFile, jsonFilePath);
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

const updateJson = (version: string, jsonFile: any, filePath: string): void => {
  jsonFile.version = version;
  fs.writeFileSync(filePath, JSON.stringify(jsonFile, null, 4));
}

const updateBuildnumberOnAzure = (version: string): void => {
  // log to output so that azure can use it
  console.log(`##vso[build.updatebuildnumber]${version}`);
}

export default simpleVersioner;


