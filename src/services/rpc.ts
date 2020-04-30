import { uuidv4 } from '@/utils/uuid'
import { Base64 } from 'js-base64'

const constraints = {
  audio: true,
  video: false
}
const configuration:any = {
  iceServers: [{
    urls: 'turn:34.85.105.240:443',
    username: 'webrtc',
    credential: 'turnpassword'
  }],
  iceTransportPolicy: 'relay',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
  sdpSemantics: 'unified-plan'
}

const _AudioContext:any = (window as any).AudioContext || (window as any).webkitAudioContext
const audioCtx = new _AudioContext()
let ucid = ''
let uid = ''
let nickname = ''
let rnameRPC = ''
let unameRPC = ''
let onConnect = (stream:any, analyser:any, trackId:string, uid:string, nickname:string) => {}
let onDisconnect = (trackId:string) => {}
let onError = (err:any) => {}
let onResume = (err:any) => {}

export function launch (room, _nickname, _uid, _onConnect, _onDisconnect, _onResume, _onError) {
  const uname = _uid + ':' + Base64.encode(_nickname)
  rnameRPC = encodeURIComponent(room)
  unameRPC = encodeURIComponent(uname)
  uid = _uid
  onConnect = _onConnect
  onDisconnect = _onDisconnect
  onResume = _onResume
  onError = _onError
  nickname = _nickname
  start()
}

async function rpc (method, params) {
  try {
    const response = await fetch('https://rpc.kraken.fm', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({ id: uuidv4(), method: method, params: params }) // body data type must match "Content-Type" header
    })
    return response.json() // parses JSON response into native JavaScript objects
  } catch (err) {
    console.log('fetch error', method, params, err)
    return await rpc(method, params)
  } finally {
  }
}

async function subscribe (pc:any) {
  const res = await rpc('subscribe', [rnameRPC, unameRPC, ucid])
  if (res.error && typeof res.error === 'string' && res.error.indexOf(unameRPC + ' not found in')) {
    console.log('reconnect', res.error)
    if (onResume) {
      onResume(res.error)
    }
    setTimeout(async () => {
      pc.close()
      await start()
    }, 500)
    return
  }
  if (res.data && res.data.type === 'offer') {
    console.log('subscribe offer', res.data)
    await pc.setRemoteDescription(res.data)
    const sdp = await pc.createAnswer()
    await pc.setLocalDescription(sdp)
    await rpc('answer', [rnameRPC, unameRPC, ucid, JSON.stringify(sdp)])
  }
  setTimeout(function () {
    subscribe(pc)
  }, 3000)
}

export async function start () {
  try {
    document.querySelectorAll('.peer').forEach((el) => el.remove())

    const pc = new RTCPeerConnection(configuration)
    pc.createDataChannel('useless') // FIXME remove this line

    pc.onicecandidate = ({ candidate }) => {
      rpc('trickle', [rnameRPC, unameRPC, ucid, JSON.stringify(candidate)])
    }

    pc.ontrack = (event) => {
      console.log('ontrack', event)

      const stream = event.streams[0]
      const sid = decodeURIComponent(stream.id)
      const id = sid.split(':')[0]
      // console.log('sid', sid)
      let name = sid.split(':')[1]
      try {
        name = Base64.decode(name)
      } catch (err) {}
      // console.log(stream, id, name)

      if (id === uid) {
        return
      }

      event.track.onmute = (event) => {
        if (onDisconnect) {
          const trackId:string = (event as any).target.id as string
          console.log('onmute', trackId, event)
          onDisconnect(trackId)
        }
      }

      let analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.minDecibels = -80;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
      audioCtx.createMediaStreamSource(stream).connect(analyser)
      // enable audio playing for people except me
      // analyser.connect(audioCtx.destination)

      if (onConnect) {
        const trackId:string = (event as any).track.id as string
        onConnect(stream, analyser, trackId, id, name)
      }
    }

    var stream
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      // document.getElementById('microphone').style.display = 'block'
      console.error(err)
      if (onError) {
        onError(err)
      }
      return
    }
    let analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.minDecibels = -80;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    audioCtx.createMediaStreamSource(stream).connect(analyser)

    if (onConnect) {
      onConnect(stream, analyser, 'me', uid, nickname)
    }

    audioCtx.resume()

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream)
    })
    await pc.setLocalDescription(await pc.createOffer())

    var res = await rpc('publish', [rnameRPC, unameRPC, JSON.stringify(pc.localDescription)])
    if (res.data && res.data.sdp.type === 'answer') {
      await pc.setRemoteDescription(res.data.sdp)
      ucid = res.data.track
      subscribe(pc)
    }
  } catch (err) {
    if (onError) {
      onError(err)
    }
  }
}
