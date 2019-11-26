import path from 'path';
import fs from 'fs';
import simpleVersioner from './index';


test('Should give back the normal version as build was for master', () => {
    const currentCWD = process.cwd();
    process.chdir(path.join(currentCWD, 'mocks', 'master'));

    process.env.BUILD_REASON = 'Ci Individual';
    process.env.BUILD_SOURCEBRANCH = 'refs/heads/master';
    process.env.BUILD_SOURCEVERSION = '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397';

    const result = simpleVersioner();
    expect(result).toBe('1.0.0');
    process.chdir(path.join(currentCWD));

    // remove env
    delete process.env.BUILD_REASON;
    delete process.env.BUILD_SOURCEBRANCH;
    delete process.env.BUILD_SOURCEVERSION;
});


test('Should give back a version for develop branch', () => {
    const currentCWD = process.cwd();
    process.chdir(path.join(currentCWD, 'mocks', 'develop'));

    process.env.BUILD_REASON = 'Ci Individual';
    process.env.BUILD_SOURCEBRANCH = 'refs/heads/develop';
    process.env.BUILD_SOURCEVERSION = '1c2abf44a3b28c5f4385d95b9f3fe83a1af94397';

    const result = simpleVersioner();
    expect(result).toBe('1.0.1-refs-heads-develop-1c2abf44');
    const pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')).toString());

    expect(pkgJson.version).toBe('1.0.1-refs-heads-develop-1c2abf44');

    // remove env

    pkgJson.version = '1.0.1';
    fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(pkgJson, null, 4));
    delete process.env.BUILD_REASON;
    delete process.env.BUILD_SOURCEBRANCH;
    delete process.env.BUILD_SOURCEVERSION;
    process.chdir(path.join(currentCWD));


});