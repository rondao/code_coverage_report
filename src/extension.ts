import * as vscode from 'vscode';
import { CoverageProvider } from './coverageProvider';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider(
		'coverageReport',
		new CoverageProvider()
	);

	vscode.window.createTreeView('coverageReport', {
		treeDataProvider: new CoverageProvider()
	});
}

export function deactivate() { }
