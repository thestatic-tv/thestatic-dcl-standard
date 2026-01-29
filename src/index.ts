// ===========================================================================
//                NOT NEEDED FOR YOUR SCENE - DEMO ONLY
// ===========================================================================
import { getDemoKey } from './DELETE_THIS_DEMO'
import './DELETE_THIS_DEMO'
export let staticTV: StaticTVClient
export let videoLabel: any  // For demo to update
export function setVideoLabel(entity: any) { videoLabel = entity }
// ===========================================================================
//                NOT NEEDED FOR YOUR SCENE - DEMO ONLY
// ===========================================================================


// ===========================================================================
//        YOU DO NOT NEED DELETE_THIS_DEMO.ts FOR YOUR SCENE - DEMO ONLY
// ===========================================================================


// ===========================================================================
//               DONT FORGET TO RUN: npm i @thestatic-tv/dcl-sdk
// ===========================================================================


// ===========================================================================
//                     thestatic.tv - STANDARD Tier
//           Get your key: https://thestatic.tv
// ===========================================================================


// ===========================================================================
//                YOU ONLY NEED WHATS BELOW HERE FOR YOUR SCENE
// ===========================================================================

import { engine, Transform, MeshRenderer, MeshCollider, Material, TextShape, VideoPlayer } from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { StaticTVClient, GuideVideo } from '@thestatic-tv/dcl-sdk'

// =============================================================================
// VIDEO SCREEN - Create your screen entity
// =============================================================================
const videoScreen = engine.addEntity()
Transform.create(videoScreen, {
  position: Vector3.create(8, 3, 14.9),
  scale: Vector3.create(7.2, 4.05, 0.01),  // 16:9 aspect, thin box
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
MeshRenderer.setBox(videoScreen)
MeshCollider.setBox(videoScreen)

// =============================================================================
// VIDEO PLAYBACK - You control the VideoPlayer
// =============================================================================
function playVideoOnScreen(url: string) {
  VideoPlayer.createOrReplace(videoScreen, {
    src: url,
    playing: true,
    loop: false,
    volume: 0.8
  })
  Material.setPbrMaterial(videoScreen, {
    texture: Material.Texture.Video({ videoPlayerEntity: videoScreen }),
    roughness: 1.0,
    metallic: 0,
    emissiveColor: Color4.White(),
    emissiveIntensity: 0.5,
    emissiveTexture: Material.Texture.Video({ videoPlayerEntity: videoScreen })
  })
}

function stopVideoOnScreen() {
  VideoPlayer.createOrReplace(videoScreen, {
    src: 'https://media.thestatic.tv/fallback-loop.mp4',
    playing: true,
    loop: true,
    volume: 0.5
  })
  Material.setPbrMaterial(videoScreen, {
    texture: Material.Texture.Video({ videoPlayerEntity: videoScreen }),
    roughness: 1.0,
    metallic: 0,
    emissiveColor: Color4.White(),
    emissiveIntensity: 0.5,
    emissiveTexture: Material.Texture.Video({ videoPlayerEntity: videoScreen })
  })
}

// =============================================================================
// VIDEO SELECT CALLBACK - Called when user picks a video from Guide
// =============================================================================
function handleVideoSelect(video: GuideVideo) {
  // Play the selected video
  playVideoOnScreen(video.src)

  // Update video label (demo only - delete this line)
  if (videoLabel) TextShape.getMutable(videoLabel).text = video.name

  // Track watch time
  if (staticTV.heartbeat && video.channelId) {
    staticTV.heartbeat.startWatching(video.channelId)
  }
}

// =============================================================================
// MAIN - Initialize SDK with callbacks
// =============================================================================
export function main() {
  // Start with fallback video
  stopVideoOnScreen()

  // Initialize SDK - callbacks give YOU control of video playback
  staticTV = new StaticTVClient({
    apiKey: getDemoKey('dcls_YOUR_API_KEY_HERE'),  // <-- Put your key here
    onVideoPlay: (url) => playVideoOnScreen(url),
    onVideoStop: () => stopVideoOnScreen(),
    guideUI: { onVideoSelect: handleVideoSelect },
    chatUI: { position: 'right' }
  })

  // Initialize UI modules
  initializeUI()
}

// =============================================================================
// UI INIT - Wait for tier detection then initialize Guide/Chat
// =============================================================================
async function initializeUI() {
  // Wait up to 10 seconds for tier to be detected
  let attempts = 0
  while (staticTV.isFree && attempts < 20) {
    await new Promise(r => setTimeout(r, 500))
    attempts++
  }

  if (staticTV.guideUI) await staticTV.guideUI.init()
  if (staticTV.chatUI) await staticTV.chatUI.init()
}

// =============================================================================
// UI RENDERER - Required for Guide/Chat to appear (MUST be outside main)
// =============================================================================
ReactEcsRenderer.setUiRenderer(() => {
  if (!staticTV) return null
  return ReactEcs.createElement(UiEntity, {
    uiTransform: { width: '100%', height: '100%', positionType: 'absolute' },
    children: [
      staticTV.guideUI?.getComponent(),
      staticTV.chatUI?.getComponent()
    ].filter(Boolean)
  })
})
