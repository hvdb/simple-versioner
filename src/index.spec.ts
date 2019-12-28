jest.mock('fs');

import simpleVersioner from './index';
const spy = jest.spyOn(console, 'log');


const setup = (buildReason: string, sourceBranch: string, sourceVersion: string, version: string) => {
    require('fs').__setMockFile(JSON.stringify({ version }));

    process.env.BUILD_REASON = buildReason;
    process.env.BUILD_SOURCEBRANCH = sourceBranch;
    process.env.BUILD_SOURCEVERSION = sourceVersion;
}

const tearDown = () => {
    delete process.env.BUILD_REASON;
    delete process.env.BUILD_SOURCEBRANCH;
    delete process.env.BUILD_SOURCEVERSION;
    jest.restoreAllMocks();
}

afterEach(() => {
    tearDown();
});

test('Should give back the normal version as build was for master', () => {
    setup('Ci Individual', 'refs/heads/master', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '1.0.0');

    const result = simpleVersioner();
    expect(result).toBe('1.0.0');
    expect(spy).toHaveBeenCalledWith("##vso[build.updatebuildnumber]1.0.0");
});


test('Should give back a version for develop branch', () => {
    setup('Ci Individual', 'refs/heads/develop', '1d2abf44a3b28c5f4385d95b9f3fe83a1af94397', '1.0.1');

    const result = simpleVersioner();
    expect(result).toBe('1.0.1-refs-heads-develop-1d2abf44');
});