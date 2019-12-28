const fs = jest.genMockFromModule('fs');

let mockFile: object = {};

function __setMockFile(newMockFile: object) {
    mockFile = newMockFile;
}

function readFileSync(filePath: string | number) {
    return mockFile;
}

function writeFileSync(path: string | number, data: any, options?: object): void{
}



// If anyone knows how to avoid the type assertion feel free to edit this answer
(fs as any).__setMockFile = __setMockFile;
(fs as any).readFileSync = readFileSync;
(fs as any).writeFileSync = writeFileSync;

module.exports = fs;