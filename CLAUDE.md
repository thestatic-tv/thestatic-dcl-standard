# thestatic-dcl-standard - AI Session Entry

## What this is

A **starter template** demonstrating the STANDARD tier of `@thestatic-tv/dcl-sdk`.
Users clone this to get a Decentraland scene with video streaming, a channel guide, and real-time chat.

**This is not a production scene.** It's a reference implementation / clone-me template.
The equivalent deployed production scene is `thestatic-hq` (or `thestatic-popup` for showcase).

## What STANDARD tier provides

- Video screen with channel selection
- Guide UI (browse live/scheduled channels - G key)
- Chat UI (real-time messages - C key)
- Heartbeat tracking (watch time metrics)
- Visitor analytics

## Quick commands

```bash
npm install
npm start              # Local preview
npm run deploy         # Deploy to mainnet (after updating scene.json)
npm run deploy:test    # Test world
```

## Key file

`src/index.ts` - Initialize with a Standard tier key (`dcls_*` prefix):

```typescript
staticTV = new StaticTVClient({
  apiKey: 'dcls_YOUR_KEY_HERE',
  guideUI: { onVideoSelect: handleVideoSelect },
  chatUI: { position: 'right' }
})
```

Get a key at [thestatic.tv/dashboard](https://thestatic.tv/dashboard).

## SDK tiers (for context)

| Tier | Key prefix | Features |
|------|-----------|---------|
| Free | `dcls_*` | Visitor tracking only |
| **Standard** | `dcls_*` | Video + Guide + Chat - **this template** |
| Pro | `dclk_*` | + Admin Panel |

See `thestatic-dcl-free` and `thestatic-dcl-pro` for the other tiers.

## Cross-repo dependencies

- `thestatic-dcl-sdk` - publishes `@thestatic-tv/dcl-sdk` to npm
- `thestatic-tv` - backend API this scene talks to
