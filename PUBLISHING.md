# Publishing Guide

This repository uses GitHub Actions to automate publishing all packages (`core`, `react`, `angular`, `native`, and `vue`) to NPM. 

To release a new version of the packages, follow these steps:

## 1. Bump the Versions
Before publishing, you must increment the version number in every package to match your new release.

You can do this manually by editing `version` in every `package.json`, or by running a script to do it uniformly. 

*(Example: changing `"1.0.2"` to `"1.0.3"`)*

## 2. Commit the Changes
Commit your version bumps to the `main` branch.

```bash
git add .
git commit -m "chore: bump version to v1.0.3"
git push origin main
```

## 3. Create and Push a Tag
The GitHub Action (`.github/workflows/publish.yml`) is configured to trigger automatically **only when a version tag (starting with `v`) is pushed to the repository**.

Create a new tag matching your new version and push it:

```bash
git tag v1.0.3
git push origin v1.0.3
```

## 4. Verification
Once the tag is pushed:
1. Go to the **Actions** tab in your GitHub repository.
2. You will see a workflow named **"Publish to npm"** running.
3. The workflow will automatically install dependencies, run the workspace build, and execute `npm publish` for every package using your stored `NPM_TOKEN` secret.
4. When the action completes, all 5 packages will be live on the NPM registry!
