// commentOnPRs.js
async function commentOnPRs(github, context) {
    const newTag = context.ref.replace('refs/tags/', '');
    const { data: release } = await github.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag: newTag,
    });
  
    const prNumbers = release.body.match(/\(#(\d+)\)/g).map((match) => match.replace(/\D/g, ''));
  
    for (const prNumber of prNumbers) {
      await github.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        body: `This PR has been included in release: ${newTag}, see the [release notes](https://github.com/${context.repo.owner}/${context.repo.repo}/releases/tag/${newTag}).`,
      });
    }
  }
  
  module.exports = commentOnPRs;
  