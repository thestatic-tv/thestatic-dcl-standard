/**
 * ===========================================================================
 *    DELETE THIS ENTIRE FILE WHEN BUILDING YOUR OWN SCENE
 * ===========================================================================
 *
 * This file contains:
 * - Demo API key (for testing without your own key)
 * - Demo scene visuals (floor, frame, info panel, buttons)
 *
 * None of this is needed for video/chat to work.
 * Just delete this file and use your own API key in index.ts
 *
 * ===========================================================================
 */

import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  TextShape,
  pointerEventsSystem,
  InputAction
} from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { openExternalUrl } from '~system/RestrictedActions'
import * as index from './index'

// ===========================================================================
// DEMO KEY - Delete getDemoKey and just use your key directly in index.ts
// ===========================================================================

// Base64 decoder (no external dependencies)
const decodeB64 = (s: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let r = ''
  for (let i = 0; i < s.length; i += 4) {
    const a = chars.indexOf(s[i]), b = chars.indexOf(s[i + 1])
    const c = chars.indexOf(s[i + 2]), d = chars.indexOf(s[i + 3])
    r += String.fromCharCode((a << 2) | (b >> 4))
    if (c !== -1) r += String.fromCharCode(((b & 15) << 4) | (c >> 2))
    if (d !== -1) r += String.fromCharCode(((c & 3) << 6) | d)
  }
  return r
}

// Demo key configuration (obfuscated) - STANDARD tier
const demoConfig = {
  id: 'standard-demo-key',
  data: 'FxcNHTtTQwdOVFZUCxtdUUtEF1daUAREUx9WAVlXSQlUQENGAg=='
}

// Decode the demo key
const decodeDemoKey = (): string => {
  const decoded = decodeB64(demoConfig.data)
  let result = ''
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ demoConfig.id.charCodeAt(i % demoConfig.id.length))
  }
  return result
}

/**
 * Get API key - returns your key if provided, otherwise uses demo key.
 * Demo keys only work in preview mode at coordinates 0,0.
 */
export const getDemoKey = (userKey: string): string => {
  if (userKey && !userKey.includes('your_key') && !userKey.includes('YOUR_')) {
    return userKey
  }
  return decodeDemoKey()
}

// ===========================================================================
// DEMO VISUALS - All of this is just for the demo scene
// ===========================================================================
const COLORS = {
  cyan: Color4.create(0, 0.9, 0.9, 1),
  cyanGlow: Color4.create(0, 0.4, 0.4, 1),
  darkPanel: Color4.create(0.08, 0.08, 0.1, 1),
  green: Color4.create(0, 1, 0.5, 1),
  greenGlow: Color4.create(0, 0.5, 0.25, 1),
  white: Color4.create(1, 1, 1, 1)
}

// Floor
const floor = engine.addEntity()
Transform.create(floor, { position: Vector3.create(8, 0, 8), scale: Vector3.create(16, 0.1, 16) })
MeshRenderer.setBox(floor)
MeshCollider.setBox(floor)
Material.setPbrMaterial(floor, { albedoColor: COLORS.darkPanel })

// Video screen frame (decorative)
const videoFrame = engine.addEntity()
Transform.create(videoFrame, { position: Vector3.create(8, 3, 15), scale: Vector3.create(7.5, 4.3, 0.15) })
MeshRenderer.setBox(videoFrame)
Material.setPbrMaterial(videoFrame, { albedoColor: COLORS.cyan, emissiveColor: COLORS.cyanGlow, emissiveIntensity: 2 })

// Video label background
const videoLabelBack = engine.addEntity()
Transform.create(videoLabelBack, { position: Vector3.create(8, 0.7, 14.85), scale: Vector3.create(6, 0.6, 0.1) })
MeshRenderer.setBox(videoLabelBack)
Material.setPbrMaterial(videoLabelBack, { albedoColor: COLORS.darkPanel })

// Video label (export to index for updating)
const videoLabelEntity = engine.addEntity()
Transform.create(videoLabelEntity, { position: Vector3.create(8, 0.7, 14.7), rotation: Quaternion.fromEulerDegrees(0, 0, 0) })
TextShape.create(videoLabelEntity, { text: 'Click GUIDE to browse channels', fontSize: 1.5, textColor: COLORS.cyan, width: 10 })
index.setVideoLabel(videoLabelEntity)

// Info Panel (south edge, opposite video screen)
const infoPanelBack = engine.addEntity()
Transform.create(infoPanelBack, { position: Vector3.create(8, 3, 1), scale: Vector3.create(8, 3.5, 0.15) })
MeshRenderer.setBox(infoPanelBack)
Material.setPbrMaterial(infoPanelBack, { albedoColor: COLORS.darkPanel })

const infoPanelFrame = engine.addEntity()
Transform.create(infoPanelFrame, { position: Vector3.create(8, 3, 0.9), scale: Vector3.create(8.2, 3.7, 0.05) })
MeshRenderer.setBox(infoPanelFrame)
Material.setPbrMaterial(infoPanelFrame, { albedoColor: COLORS.cyan, emissiveColor: COLORS.cyanGlow, emissiveIntensity: 2 })

const titleText = engine.addEntity()
Transform.create(titleText, { position: Vector3.create(8, 4.2, 1.2), rotation: Quaternion.fromEulerDegrees(0, 180, 0) })
TextShape.create(titleText, { text: 'thestatic.tv', fontSize: 4, textColor: COLORS.cyan, width: 12 })

const subtitleText = engine.addEntity()
Transform.create(subtitleText, { position: Vector3.create(8, 3.4, 1.2), rotation: Quaternion.fromEulerDegrees(0, 180, 0) })
TextShape.create(subtitleText, { text: 'STANDARD Tier Demo', fontSize: 2, textColor: COLORS.white, width: 12 })

const descText = engine.addEntity()
Transform.create(descText, { position: Vector3.create(8, 2.5, 1.2), rotation: Quaternion.fromEulerDegrees(0, 180, 0) })
TextShape.create(descText, { text: 'Video Screen + Guide UI + Chat\nClick GUIDE or CHAT buttons to try!', fontSize: 1.4, textColor: Color4.Gray(), width: 12 })

// Buttons
const dashboardButton = engine.addEntity()
Transform.create(dashboardButton, { position: Vector3.create(6, 1.5, 1.1), scale: Vector3.create(3, 0.7, 0.1) })
MeshRenderer.setBox(dashboardButton)
MeshCollider.setBox(dashboardButton)
Material.setPbrMaterial(dashboardButton, { albedoColor: COLORS.green, emissiveColor: COLORS.greenGlow, emissiveIntensity: 1 })
const dashboardButtonText = engine.addEntity()
Transform.create(dashboardButtonText, { position: Vector3.create(6, 1.5, 1.25), rotation: Quaternion.fromEulerDegrees(0, 180, 0) })
TextShape.create(dashboardButtonText, { text: 'GET API KEY', fontSize: 1.5, textColor: COLORS.darkPanel, width: 10 })
pointerEventsSystem.onPointerDown(
  { entity: dashboardButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Get your API key' } },
  () => { openExternalUrl({ url: 'https://thestatic.tv/admin/login' }) }
)

const githubButton = engine.addEntity()
Transform.create(githubButton, { position: Vector3.create(10, 1.5, 1.1), scale: Vector3.create(3, 0.7, 0.1) })
MeshRenderer.setBox(githubButton)
MeshCollider.setBox(githubButton)
Material.setPbrMaterial(githubButton, { albedoColor: COLORS.cyan, emissiveColor: COLORS.cyanGlow, emissiveIntensity: 1 })
const githubButtonText = engine.addEntity()
Transform.create(githubButtonText, { position: Vector3.create(10, 1.5, 1.25), rotation: Quaternion.fromEulerDegrees(0, 180, 0) })
TextShape.create(githubButtonText, { text: 'VIEW CODE', fontSize: 1.5, textColor: COLORS.darkPanel, width: 10 })
pointerEventsSystem.onPointerDown(
  { entity: githubButton, opts: { button: InputAction.IA_POINTER, hoverText: 'View source code' } },
  () => { openExternalUrl({ url: 'https://github.com/thestatic-tv/thestatic-dcl-standard' }) }
)

// Status Board (shows live session info)
const statusBoardBack = engine.addEntity()
Transform.create(statusBoardBack, { position: Vector3.create(2, 2.5, 8), scale: Vector3.create(0.15, 3, 5) })
MeshRenderer.setBox(statusBoardBack)
Material.setPbrMaterial(statusBoardBack, { albedoColor: COLORS.darkPanel })

const statusBoardFrame = engine.addEntity()
Transform.create(statusBoardFrame, { position: Vector3.create(1.9, 2.5, 8), scale: Vector3.create(0.05, 3.2, 5.2) })
MeshRenderer.setBox(statusBoardFrame)
Material.setPbrMaterial(statusBoardFrame, { albedoColor: COLORS.cyan, emissiveColor: COLORS.cyanGlow, emissiveIntensity: 2 })

const statusTitle = engine.addEntity()
Transform.create(statusTitle, { position: Vector3.create(2.2, 3.5, 8), rotation: Quaternion.fromEulerDegrees(0, 270, 0) })
TextShape.create(statusTitle, { text: 'SESSION STATUS', fontSize: 1.8, textColor: COLORS.cyan, width: 6 })

const statusValue = engine.addEntity()
Transform.create(statusValue, { position: Vector3.create(2.2, 2.8, 8), rotation: Quaternion.fromEulerDegrees(0, 270, 0) })
TextShape.create(statusValue, { text: 'CONNECTING...', fontSize: 1.5, textColor: Color4.create(1, 0.85, 0, 1), width: 6 })

const tierLabel = engine.addEntity()
Transform.create(tierLabel, { position: Vector3.create(2.2, 2.1, 8), rotation: Quaternion.fromEulerDegrees(0, 270, 0) })
TextShape.create(tierLabel, { text: 'TIER: STANDARD', fontSize: 1.2, textColor: COLORS.white, width: 6 })

const statusOrb = engine.addEntity()
Transform.create(statusOrb, { position: Vector3.create(2.1, 3.5, 9.5), scale: Vector3.create(0.25, 0.25, 0.25) })
MeshRenderer.setSphere(statusOrb)
Material.setPbrMaterial(statusOrb, { albedoColor: Color4.create(1, 0.85, 0, 1), emissiveColor: Color4.create(1, 0.85, 0, 1), emissiveIntensity: 3 })

// Update system for status
let lastUpdate = 0
engine.addSystem((dt: number) => {
  if (!index.staticTV) return
  lastUpdate += dt
  if (lastUpdate < 0.5) return
  lastUpdate = 0

  const isActive = index.staticTV.session?.isSessionActive() ?? false
  TextShape.getMutable(statusValue).text = isActive ? 'ACTIVE' : 'OFFLINE'
  TextShape.getMutable(statusValue).textColor = isActive ? COLORS.green : Color4.create(1, 0.2, 0.2, 1)
  Material.setPbrMaterial(statusOrb, {
    albedoColor: isActive ? COLORS.green : Color4.create(1, 0.2, 0.2, 1),
    emissiveColor: isActive ? COLORS.greenGlow : Color4.create(0.5, 0.1, 0.1, 1),
    emissiveIntensity: 4
  })
})

