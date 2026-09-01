# Git Practice Plan

## Level 1 - Basic
- git --version
- git config
- git init
- git status
- git add
- git commit
- git log
- git diff

## Level 2 - Edit and undo
- Edit `index.html`
- git diff
- git add
- git diff --staged
- git restore
- git restore --staged
- git rm

## Level 3 - Ignore
- Create `practice-notes.txt`
- Check `git status`
- Confirm it is ignored
- Test `.env`
- Learn why secrets should not be committed

## Level 4 - Branch
- git branch
- git switch -c feature/history
- edit a file
- commit
- switch main/master
- merge feature/history

## Level 5 - Conflict
Make two branches change the same line in `README.md`.
Merge one branch, then merge the other.
Resolve conflict markers:
<<<<<<<
=======
>>>>>>>
Then add and commit.

## Level 6 - GitHub
- Create empty GitHub repository
- git remote add origin ...
- git branch -M main
- git push -u origin main
- git pull
- git clone

## Level 7 - Hosting
Use GitHub Pages to host this static website.
