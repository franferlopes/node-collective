# TODO — 2026-06-22

## Session Rules
- Do not ask for confirmation
- Execute all tasks in order
- Report what was done at the end

---

## Task 1 — Create partners image directory
Create the directory `/public/images/partners/` if it does not exist.

## Task 2 — Copy and rename partner logos
Copy each file from `/logos/` to `/public/images/partners/` with the correct name:

- logos/IAAC_logo.svg → public/images/partners/partner-1.svg
- logos/LaMaquina_logo.svg → public/images/partners/partner-2.svg
- logos/ceruleansonar_logo.svg → public/images/partners/partner-3.svg
- logos/fablab_logo.svg → public/images/partners/partner-4.svg
- logos/kelpforestfoundation_logo.svg → public/images/partners/partner-5.svg
- logos/opencosmos_logo.svg → public/images/partners/partner-6.svg
- logos/seabots_logo.svg → public/images/partners/partner-7.svg

## Task 3 — Update partner alt text in layout.ejs
In `views/layout.ejs`, find the partners section and replace the generic alt text and remove the 8th partner img tag.

Replace this block:
```html
<img src="/images/partners/partner-1.svg" alt="Partner 1" loading="lazy">
<img src="/images/partners/partner-2.svg" alt="Partner 2" loading="lazy">
<img src="/images/partners/partner-3.svg" alt="Partner 3" loading="lazy">
<img src="/images/partners/partner-4.svg" alt="Partner 4" loading="lazy">
<img src="/images/partners/partner-5.svg" alt="Partner 5" loading="lazy">
<img src="/images/partners/partner-6.svg" alt="Partner 6" loading="lazy">
<img src="/images/partners/partner-7.svg" alt="Partner 7" loading="lazy">
<img src="/images/partners/partner-8.svg" alt="Partner 8" loading="lazy">
```

With this block:
```html
<img src="/images/partners/partner-1.svg" alt="IAAC" loading="lazy">
<img src="/images/partners/partner-2.svg" alt="LaMaquina" loading="lazy">
<img src="/images/partners/partner-3.svg" alt="Cerulean Sonars" loading="lazy">
<img src="/images/partners/partner-4.svg" alt="FabLab IAAC" loading="lazy">
<img src="/images/partners/partner-5.svg" alt="Kelp Forest Foundation" loading="lazy">
<img src="/images/partners/partner-6.svg" alt="Open Cosmos" loading="lazy">
<img src="/images/partners/partner-7.svg" alt="Seabots" loading="lazy">
```

## Task 4 — Git commit and push
Run the following commands:
```bash
git add .
git commit -m "fix: wire up partner logos"
git push
```
