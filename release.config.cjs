module.exports = {
	branches: [
		'main',
		{
			name: 'beta',
			prerelease: true,
		},
		{
			name: 'alpha',
			prerelease: true,
		},
	],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		'@semantic-release/changelog',
		[
			'@semantic-release/npm',
			{
				npmPublish: true,
			},
		],
		[
			'@semantic-release/git',
			{
				assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		[
			'@semantic-release/exec',
			{
				prepareCmd: 'npm run build',
			},
		],
		[
			'@semantic-release/github',
			{
				discussionCategoryName: 'Announcements',
			},
		],
	],
};
