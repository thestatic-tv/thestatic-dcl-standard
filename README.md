# TheStatic.tv DCL SDK - STANDARD Tier Template

STANDARD tier template with video screen, Guide UI, and Chat for your Decentraland scene.

## What This Example Shows

- **Video Screen** - Stream video with automatic fallback
- **Guide UI** - Browse channels and select videos
- **Chat UI** - Real-time messaging with other viewers
- **Visitor Tracking** - Session analytics included

## SDK Tiers

| Tier | Price | Features |
|------|-------|----------|
| **FREE** | $0 | Session tracking only |
| **STANDARD** | $10/mo | Video + Guide + Chat - THIS TEMPLATE |
| **PRO** | $15/mo | + In-Scene Admin Panel |

## Quick Start

```bash
npm install
npm start
```

The scene works immediately for testing with demo key!

## Use Your Own Key

1. Get a key at [thestatic.tv/admin/login](https://thestatic.tv/admin/login)
2. Open `src/index.ts` and replace `dcls_YOUR_API_KEY_HERE` with your key
3. Delete `DELETE_THIS_DEMO.ts` (it's just for the demo)

## Video Screen Setup

You control video playback - SDK tells you what to play via callbacks:

```typescript
// 1. Create your screen entity
const videoScreen = engine.addEntity()
Transform.create(videoScreen, {
  position: Vector3.create(8, 3, 14.9),
  scale: Vector3.create(7.2, 4.05, 0.01)  // 16:9 aspect, thin box
})
MeshRenderer.setBox(videoScreen)

// 2. Your playback functions
function playVideoOnScreen(url: string) {
  VideoPlayer.createOrReplace(videoScreen, { src: url, playing: true })
  Material.setPbrMaterial(videoScreen, {
    texture: Material.Texture.Video({ videoPlayerEntity: videoScreen })
  })
}

// 3. Initialize SDK with callbacks
staticTV = new StaticTVClient({
  apiKey: 'dcls_YOUR_API_KEY_HERE',
  onVideoPlay: (url) => playVideoOnScreen(url),
  onVideoStop: () => stopVideoOnScreen(),
  guideUI: { onVideoSelect: handleVideoSelect },
  chatUI: { position: 'right' }
})
```

## Project Structure

```
thestatic-dcl-standard/
├── src/
│   ├── index.ts              # Your scene (THIS IS WHAT YOU NEED)
│   └── DELETE_THIS_DEMO.ts   # Demo key - DELETE when using your own key
├── scene.json                # Scene metadata
└── package.json              # Dependencies
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run locally in preview mode |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to Decentraland |
| `npm run deploy:test` | Deploy to test world server |

## Other Templates

| Template | Tier | Features |
|----------|------|----------|
| **[Free](https://github.com/thestatic-tv/thestatic-dcl-free)** | FREE | Session tracking only |
| **[Pro](https://github.com/thestatic-tv/thestatic-dcl-pro)** | PRO | + Admin Panel controls |

## Resources

- [Get API Key](https://thestatic.tv/admin/login)
- [SDK on npm](https://www.npmjs.com/package/@thestatic-tv/dcl-sdk)
- [thestatic.tv](https://thestatic.tv)
