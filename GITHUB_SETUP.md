# GitHub Authentication Setup Guide

To enable "Sign in with GitHub", follow these steps:

## 1. Create a GitHub OAuth App

1. Go to your GitHub Settings -> [Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Fill in the details:
   - **Application Name**: `AI Resume Builder`
   - **Homepage URL**: `https://ai-resume-builder-five-sage.vercel.app`
   - **Authorization callback URL**: `https://ai-resume-builder-five-sage.vercel.app/api/auth/callback/github`

## 2. Get Client ID and Secret

1. After creating the app, copy the **Client ID**.
2. Click **Generate a new client secret** and copy the **Client Secret**.

## 3. Add to Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Create/Select your project: `ai-resume-builder`.
3. Go to **Settings** -> **Environment Variables**.
4. Add the following variables:
   - `GITHUB_ID`: Your Client ID
   - `GITHUB_SECRET`: Your Client Secret
5. Click **Save**.

## 4. Test

Go to your site, click **Sign In**, and select **Continue with GitHub**.
