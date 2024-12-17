export default {
  branches: ['main'],
  extends: 'semantic-release-monorepo',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'chore', release: false },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/exec',
      {
        // eslint-disable-next-line no-template-curly-in-string
        prepareCmd: 'pnpm version ${nextRelease.version} --git-tag-version=false',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'apps/**/CHANGELOG.md', 'apps/**/package.json'],
      },
    ],
    '@semantic-release/github',
  ],
}
