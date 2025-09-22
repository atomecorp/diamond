# UI demo: create a styled div with gradient + shadow, and wire interactions

# Container full-screen with gradient background
container = document.createElement('div')
container['style']['width'] = '100%'
container['style']['height'] = '100vh'
container['style']['margin'] = '0'
container['style']['display'] = 'flex'
container['style']['alignItems'] = 'center'
container['style']['justifyContent'] = 'center'
container['style']['background'] = 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)'
container['style']['position'] = 'relative'
document['body'].appendChild(container)

# Draggable, resizable card
box = document.createElement('div')
box['style']['width'] = '220px'
box['style']['height'] = '140px'
box['style']['borderRadius'] = '16px'
box['style']['boxShadow'] = '0 10px 25px rgba(0,0,0,.25)'
box['style']['background'] = 'linear-gradient(135deg, #6EE7F9 0%, #9333EA 100%)'
box['style']['position'] = 'relative'
box['style']['cursor'] = 'grab'
box['style']['userSelect'] = 'none'
box['style']['transform'] = 'translate(0px, 0px)'
box['style']['transition'] = 'transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease'
container.appendChild(box)

label = document.createElement('div')
label['style']['color'] = '#fff'
label['style']['fontFamily'] = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
label['style']['fontSize'] = '14px'
label['style']['padding'] = '12px'
label['innerText'] = 'Click / Tap / Drag me'
box.appendChild(label)

# Resize handle (bottom-right)
handle = document.createElement('div')
handle['style']['position'] = 'absolute'
handle['style']['right'] = '6px'
handle['style']['bottom'] = '6px'
handle['style']['width'] = '14px'
handle['style']['height'] = '14px'
handle['style']['borderRadius'] = '3px'
handle['style']['background'] = 'rgba(255,255,255,.85)'
handle['style']['boxShadow'] = '0 1px 3px rgba(0,0,0,.3)'
handle['style']['cursor'] = 'nwse-resize'
box.appendChild(handle)

# Hover animation
box.addEventListener('mouseenter', ->(e) {
  box['style']['boxShadow'] = '0 14px 32px rgba(0,0,0,.32)'
})
box.addEventListener('mouseleave', ->(e) {
  box['style']['boxShadow'] = '0 10px 25px rgba(0,0,0,.25)'
})

# Click / Tap
box.addEventListener('click', ->(e) { console.log('clicked') })
box.addEventListener('touchstart', ->(e) { console.log('tap') })

# Drag logic
dragging = false
startX = 0
startY = 0
boxX = 0.0
boxY = 0.0

parse_translate = ->(t) {
  m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.match(t)
  if m
    [m[1].to_f, m[2].to_f]
  else
    [0.0, 0.0]
  end
}

startDrag = ->(clientX, clientY) {
  dragging = true
  box['style']['cursor'] = 'grabbing'
  box['style']['transition'] = 'none'
  startX = clientX
  startY = clientY
  coords = parse_translate.call(box['style']['transform'] || '')
  boxX = coords[0]
  boxY = coords[1]
}

moveDrag = ->(clientX, clientY) {
  return unless dragging
  dx = clientX - startX
  dy = clientY - startY
  box['style']['transform'] = "translate(#{(boxX + dx).to_i}px, #{(boxY + dy).to_i}px)"
}

stopDrag = -> {
  dragging = false
  box['style']['cursor'] = 'grab'
  box['style']['transition'] = 'transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease'
}

# Mouse drag
box.addEventListener('mousedown', ->(e) {
  startDrag.call(e['clientX'], e['clientY'])
  e['preventDefault'].call()
})
document.addEventListener('mousemove', ->(e) {
  moveDrag.call(e['clientX'], e['clientY'])
})
document.addEventListener('mouseup', ->(e) { stopDrag.call() })

# Touch drag
box.addEventListener('touchstart', ->(e) {
  t = e['touches'][0]
  startDrag.call(t['clientX'], t['clientY'])
})
document.addEventListener('touchmove', ->(e) {
  t = e['touches'][0]
  moveDrag.call(t['clientX'], t['clientY'])
})
document.addEventListener('touchend', ->(e) { stopDrag.call() })

# Resize logic
resizing = false
startW = 0
startH = 0

handle.addEventListener('mousedown', ->(e) {
  resizing = true
  startX = e['clientX']
  startY = e['clientY']
  startW = box['offsetWidth']
  startH = box['offsetHeight']
  e['stopPropagation'].call()
  e['preventDefault'].call()
})

document.addEventListener('mousemove', ->(e) {
  if resizing
    dw = e['clientX'] - startX
    dh = e['clientY'] - startY
    w = [100, (startW + dw)].max.to_i
    h = [80, (startH + dh)].max.to_i
    box['style']['width'] = "#{w}px"
    box['style']['height'] = "#{h}px"
  end
})
document.addEventListener('mouseup', ->(e) { resizing = false })

# Simple drop zone
dropzone = document.createElement('div')
dropzone['style']['position'] = 'absolute'
dropzone['style']['top'] = '20px'
dropzone['style']['left'] = '20px'
dropzone['style']['width'] = '120px'
dropzone['style']['height'] = '80px'
dropzone['style']['border'] = '2px dashed rgba(255,255,255,.75)'
dropzone['style']['borderRadius'] = '8px'
dropzone['style']['color'] = '#fff'
dropzone['style']['display'] = 'flex'
dropzone['style']['alignItems'] = 'center'
dropzone['style']['justifyContent'] = 'center'
dropzone['innerText'] = 'Drop here'
container.appendChild(dropzone)

isOver = ->(el, x, y) {
  r = el['getBoundingClientRect'].call()
  x >= r['left'] && x <= r['right'] && y >= r['top'] && y <= r['bottom']
}

document.addEventListener('mouseup', ->(e) {
  if isOver.call(dropzone, e['clientX'], e['clientY'])
    box['style']['transform'] = 'translate(20px, 20px)'
    console.log('dropped')
  end
})
