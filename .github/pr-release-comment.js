module.exports = async ({github, context, core}) => {
  const newTag = context.ref.replace('refs/tags/', '');
  const releases = await github.rest.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  const release = releases.find((rel) => rel.tag_name === newTag);

  if (!release) {
    console.log(`Release not found for tag ${newTag}`);
    return;
  }

  const prNumbers = release.body.match(/\(#(\d+)\)/g).map((match) => match.replace(/\D/g, ''));

  for (const prNumber of prNumbers) {
    try {
      await github.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: `This PR has been included in release: ${newTag}, see the [release notes](https://github.com/${context.repo.owner}/${context.repo.repo}/releases/tag/${newTag}).`,
      });
    } catch (error) {
      console.error(`Failed to comment on PR #${prNumber}: `, error);
    }
  }
}