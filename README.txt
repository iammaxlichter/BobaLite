# Ensure you’re on the main branch
git checkout main

# Push just the contents of `wwwroot` to the gh-pages branch
git subtree push --prefix wwwroot origin gh-pages