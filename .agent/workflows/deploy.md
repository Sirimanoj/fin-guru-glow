---
description: Deploy FinGenius to Vercel
---

# How to Deploy FinGenius

The easiest way to publish this web app is using **Vercel**. It provides free hosting for frontend projects and integrates seamlessly with GitHub.

## Prerequisites
1. A [GitHub account](https://github.com/).
2. A [Vercel account](https://vercel.com/) (you can sign up with GitHub).

## Step 1: Push to GitHub
First, we need to push your code to a GitHub repository.

1. Create a new repository on GitHub (e.g., `fin-guru-glow`).
2. Run the following commands in your terminal to push your local code:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fin-guru-glow.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your actual GitHub username)*

## Step 2: Deploy on Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Select your `fin-guru-glow` repository and click **Import**.
4. Vercel will detect that it's a Vite project. The default settings are usually correct:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

## Step 3: Environment Variables (Later)
When we connect Supabase, you will need to add your environment variables in Vercel:
1. Go to your Project Settings -> **Environment Variables**.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Redeploy for changes to take effect.

## Alternative: Netlify
You can also use Netlify by dragging and dropping the `dist` folder (created by `npm run build`) into their dashboard, but connecting via GitHub is recommended for automatic updates.
