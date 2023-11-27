#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const project_root = path.resolve(__dirname, '..');

const file = path.join(project_root, 'src', 'config.local.ts');
const content = `// This file is automatically generated. The user needs to manually fill in the necessary parameters.\n
export const language = 'en'; // 'en' or 'zh-Hans'
export const release_area = 'global'; // 'china' or 'global'
`;
if (fs.existsSync(file) === false) {
  fs.writeFileSync(file, content, 'utf-8');
}
