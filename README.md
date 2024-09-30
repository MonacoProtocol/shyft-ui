# Monaco Protocol UI x Shyft

An example UI for the monaco protocol built using the [shyft graphQL API](https://shyft.to/). Built using [nextJS](https://nextjs.org/) and the [nextUI](https://nextui.org/) framework.

# Getting Started

- To get started you will need an API key from shyft. Through shyft you can access their graphQL API and their RPC node. Add them to [src/config/settings.ts](/src/config/settings.ts) to get connected.
- You then need to set the API key as an env variable `export NEXT_PUBLIC_SHYFT_API_KEY=<API_KEY`.

## Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
