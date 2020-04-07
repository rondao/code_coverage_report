import * as vscode from 'vscode';

export class CoverageProvider implements vscode.TreeDataProvider<Coverage> {
    getTreeItem(element: Coverage): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Coverage): Thenable<Coverage[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return vscode.workspace.findFiles('**/lcov.info').then((Uris) => {
                if (Uris.length > 0) {
                    return this.getCoverageInLcovInfo(Uris[0].fsPath);
                } else {
                    vscode.window.showInformationMessage('No lcov.info file found at workspace');
                    return Promise.resolve([]);
                }
            });
        }
    }

    private async getCoverageInLcovInfo(lcovInfoPath: string): Promise<Coverage[]> {
        return new Promise(function (resolve, reject) {
            const lcovParser = require('lcov-parse');
            lcovParser(lcovInfoPath, function (err: any, data: any[]) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.map(cov => new Coverage(cov.file, cov.lines.found, cov.lines.hit, vscode.TreeItemCollapsibleState.None)));
                }
            });
        });
    }
}

class Coverage extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly linesFound: number,
        public readonly linesHit: number,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        return ' ';
    }

    get description(): string {
        return `(${this.linesHit}/${this.linesFound})`;
    }
}