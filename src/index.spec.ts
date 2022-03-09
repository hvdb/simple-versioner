jest.mock('fs');

import simpleVersioner from './index';
const spy = jest.spyOn(console, 'log');


const setup = (buildReason: string, sourceBranch: string, sourceVersion: string, version: string, parameters?: string[]) => {
    require('fs').__setMockFile(JSON.stringify({ version }));

    process.env.BUILD_REASON = buildReason;
    process.env.BUILD_SOURCEBRANCH = sourceBranch;
    process.env.BUILD_SOURCEVERSION = sourceVersion;
    if (parameters) {
        process.argv = ['', ''].concat(parameters);
    }
}

const tearDown = () => {
    delete process.env.BUILD_REASON;
    delete process.env.BUILD_SOURCEBRANCH;
    delete process.env.BUILD_SOURCEVERSION;
    jest.clearAllMocks();
}

afterEach(() => {
    tearDown();
});

test('Should give back the normal version as build was for master', () => {
    setup('Ci Individual', 'refs/heads/master', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.0');

    const result = simpleVersioner();
    expect(result).toBe('4.0.0');
    expect(spy).toHaveBeenCalledWith("##vso[build.updatebuildnumber]4.0.0");
});

test('Should give back the normal version as build was for same as provided stable branch', () => {
    setup('Ci Individual', 'refs/heads/main', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.0', ['-b:main']);

    const result = simpleVersioner();
    expect(result).toBe('4.0.0');
    expect(spy).toHaveBeenCalledWith("##vso[build.updatebuildnumber]4.0.0");
});

test('Should give back the normal version as build was for same as provided stable branch and not send log to azure', () => {
    setup('Ci Individual', 'refs/heads/main', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.1', ['-b:main', '-nu']);

    const result = simpleVersioner();
    expect(result).toBe('4.0.1');
    expect(spy).not.toHaveBeenCalledWith("##vso[build.updatebuildnumber]4.0.1");
});

test('Should give back the normal version as build was for master and not send log to azure', () => {
    setup('Ci Individual', 'refs/heads/master', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.1', ['-nu']);

    const result = simpleVersioner();
    expect(result).toBe('4.0.1');
    expect(spy).not.toHaveBeenCalledWith("##vso[build.updatebuildnumber]4.010");
});


test('Should give back a version for develop branch', () => {
    setup('Ci Individual', 'refs/heads/develop', '1d2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.1');

    const result = simpleVersioner();
    expect(result).toBe('4.0.1-refs-heads-develop-1d2abf44');
});

test('Should fail because tag already exists', () => {
    setup('Ci Individual', 'refs/heads/master', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '0.0.1');

    try {
        simpleVersioner();
    } catch (exception: any) {
        expect(exception.message).toBe('Version 0.0.1 is already released, please update package.json to a newer version');
    }
});

test('Should handle different file then package.json', () => {
    setup('Ci Individual', 'refs/heads/master', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.0', ['vss-extension.json']);

    const result = simpleVersioner();
    expect(result).toBe('4.0.0');
    expect(spy).toHaveBeenCalledWith("##vso[build.updatebuildnumber]4.0.0");
});

test('Should handle different file then package.json when providing different stable branch option 1', () => {
    setup('Ci Individual', 'refs/heads/main', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.0', ['vss-extension.json', '-b:main']);

    const result = simpleVersioner();
    expect(result).toBe('4.0.0');
    expect(spy).toHaveBeenCalledWith("##vso[build.updatebuildnumber]4.0.0");
});

test('Should handle different file then package.json when providing different stable branch option 2', () => {
    setup('Ci Individual', 'refs/heads/main', '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397', '4.0.0', ['-b:main', 'vss-extension.json']);

    const result = simpleVersioner();
    expect(result).toBe('4.0.0');
    expect(spy).toHaveBeenCalledWith("##vso[build.updatebuildnumber]4.0.0");
});