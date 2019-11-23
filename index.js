#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// get version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
console.log('vers ',packageJson.version);

// check if pr
const buildReason = process.env.BUILD_REASON;
let sourceBranch = process.env.BUILD_SOURCEBRANCH;
let gitCommitHash = process.env.BUILD_SOURCEVERSION;

if (buildReason === 'PullRequest') {
  sourceBranch = process.env.SYSTEM_PULLREQUEST_SOURCEBRANCH;
  gitCommitHash = process.env.SYSTEM_PULLREQUEST_SOURCECOMMITID;
}

const gitSha = gitCommitHash.slice(0,8);
let   correctVersion = packageJson.version;
// if master use defined version.
// otherwise crwated one based on branch and sha
if (sourceBranch !== 'refs/heads/master') {
  let correctedSourceBranch = sourceBranch.replace(/\//g, "_");
  correctVersion = `${packageJson.version}-${correctedSourceBranch}-${gitSha}`
}



// log to output so that azure can use it
console.log(`##vso[build.updatebuildnumber]${correctVersion}`);
