# O Circle Games Portfolio

A responsive single-page game portfolio designed for GitHub Pages.

## Features

- Single-page portfolio showing all games.
- Game icon, name and description.
- Unlimited custom buttons per game: Play Store, App Store, Steam, Web Playable, Privacy Policy, itch.io, or anything else.
- Browser-based dashboard at `admin.html`.
- Add, edit and delete games.
- Export the current game list as `games.json`.
- No server/backend required.
- Works on GitHub Pages.

## GitHub Pages workflow

1. Upload this project to a GitHub repository.
2. Put game icons in `images/` and use paths such as `images/my-game.png`.
3. Edit the games in `admin.html`.
4. Click **Export games.json**.
5. Replace `data/games.json` in the repository with the exported file.
6. Commit/push to GitHub.
7. Enable GitHub Pages in the repository's Settings → Pages.

### Dashboard usage

The public portfolio does not display a Dashboard link. Run `admin.html` locally when you want to manage games and export `games.json`.

### Important dashboard limitation

GitHub Pages is static hosting. A dashboard cannot securely write files back to your GitHub repository by itself without a server or GitHub API integration.

This version deliberately keeps the dashboard safe and simple:
- Changes made in the dashboard are stored in your browser.
- Export creates the publishable `games.json`.
- You commit that JSON to GitHub when you want to publish changes.

For a true online CMS where you log in and click "Publish" from any device, connect the dashboard to a backend/CMS (or a serverless GitHub API workflow) rather than putting a GitHub access token in browser JavaScript.


### Company logo
Use the dashboard Company logo field to set the header logo. For GitHub Pages, place the image in `images/` and use a path such as `images/logo.png`.


## Publishing behavior

The public website always loads `data/games.json` from the deployed site. Visitor browser localStorage cannot override the published game list.

For the company logo, the public website loads `data/site.json`. In the dashboard, save your logo and click **Export site.json**, then replace `data/site.json` in the GitHub repository.

After committing/pushing `games.json` and/or `site.json`, GitHub Pages serves the new configuration. A visitor may need to refresh if their browser has an older cached copy.
