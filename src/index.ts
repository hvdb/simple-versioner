#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

interface Arguments {
  buildEnvironment: string;
}

const simpleVersioner = (args: Arguments): void => {
  const { buildEnvironment } = args;
  const version = createVersion();

  updateBuildnumberOnAzure(version);

};

const createVersion = (): string => {
  // get version from package.json
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')).toString());
  console.log('vers ', packageJson.version);

  // check if pr
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
  // otherwise crwated one based on branch and sha
  if (sourceBranch !== 'refs/heads/master') {
    let correctedSourceBranch = sourceBranch.replace(/\//g, "_");
    correctVersion = `${packageJson.version}-${correctedSourceBranch}-${gitSha}`
  }

  return correctVersion;
}

const updateBuildnumberOnAzure = (version: string): void => {
  // log to output so that azure can use it
  console.log(`##vso[build.updatebuildnumber]${version}`);
}

export default simpleVersioner;


