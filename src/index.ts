import fs from 'fs';
import path from 'path';
import tagExists from './git';

const STABLE_BRANCH_NAME = 'master';
const STABLE_BRANCH_REFERENCE = 'refs/heads/';
const FILE_TO_VERSION = 'package.json';

interface Parameters {
  fileToVersion: string;
  stableBranch: string;
  doNotUpdateBuild: boolean;
  updatedVersionForMarketplace: boolean;
  validateTagExists: boolean;
}

/**
 * Handle parameters provided.
 * 
 * @returns {Parameters} Object containing the file to version and stable branch
 */
const handleParameters = (): Parameters => {
  let fileToVersion: string = FILE_TO_VERSION;
  let stableBranch: string = STABLE_BRANCH_REFERENCE + STABLE_BRANCH_NAME;
  let doNotUpdateBuild: boolean = false;
  let updatedVersionForMarketplace: boolean = false;
  let validateTagExists: boolean = true;

  if (process.argv.length > 2) {
    // There are parameters passed, now check what they are.
    // File passed to version
    let passedFile = process.argv.find(param => param.includes('.json')) as string;
    if (passedFile) {
      fileToVersion = passedFile;
    }

    // Do not update azure buildnumber
    doNotUpdateBuild = process.argv.find(param => param.includes('-nu')) ? true : false;
    // Check if we need to create version that is compatible with vs/az marketplace.
    updatedVersionForMarketplace = process.argv.find(param => param.includes('-mp')) ? true : false;

    // Check if we need to skip tag already exists vaidation
    validateTagExists = process.argv.find(param => param.includes('-ntc')) ? false : true;
    // Different stable branch passed
    let passedBranch = process.argv.find(param => param.includes('-b:')) as string;
    if (passedBranch) {
      stableBranch = STABLE_BRANCH_REFERENCE + passedBranch.replace('-b:', '');
    }
  }

  return {
    fileToVersion,
    stableBranch,
    doNotUpdateBuild,
    updatedVersionForMarketplace,
    validateTagExists,
  }
}

const simpleVersioner = (): string => {
  let { fileToVersion, stableBranch, doNotUpdateBuild, updatedVersionForMarketplace, validateTagExists } = handleParameters();

  let jsonFilePath = path.join(process.cwd(), fileToVersion);
  const jsonFile = JSON.parse(fs.readFileSync(jsonFilePath).toString());

  // Create version based on Azure system variable
  const version = createVersion(jsonFile, stableBranch, updatedVersionForMarketplace);

  // Check if version is already released (tag exists), only if needed
  if (validateTagExists && tagExists(version)) {
    // Exit with a non success code as we should not release.
    throw new Error(`Version ${version} is already released, please update ${fileToVersion} to a newer version`);
  }
  // Update the filetoversion with the new version
  updateJson(version, jsonFile, jsonFilePath);
  // Update Azure devops BuildNumber with the new version, only if -nu is not provided
  if (!doNotUpdateBuild) {
    updateBuildnumberOnAzure(version);
  }
  return version;
};

const createVersion = (packageJson: any, stableBranch: string, updatedVersionForMarketplace: boolean): string => {
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
  // if stablebranch use defined version.
  // otherwise create one based on branch and sha
  if (sourceBranch && stableBranch && sourceBranch !== stableBranch) {
    if (updatedVersionForMarketplace) {
      const date = new Date();
      correctVersion = `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${Math.floor(date.getTime() / 1000)}`
    } else {
      let correctedSourceBranch = sourceBranch.replace(/\//g, '-');
      correctVersion = `${packageJson.version}-${correctedSourceBranch}-${gitSha}`
    }
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


