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
box['style']['touchAction'] = 'none'
box['style']['willChange'] = 'transform'
box['style']['transform'] = 'translate3d(0px, 0px, 0)'
box['style']['transition'] = 'transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease'
default_transition = box['style']['transition']
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
dragPointerId = nil
startX = 0.0
startY = 0.0
currentX = 0.0
currentY = 0.0
pendingFrame = false

window_obj = nil
begin
  window_obj = JS.global[:window]
rescue NameError
  window_obj = nil
end
raf_fn = nil
if window_obj
  raf_candidate = window_obj[:requestAnimationFrame]
  raf_fn = raf_candidate if raf_candidate
end

apply_transform = nil
apply_transform = proc do |_timestamp|
  pendingFrame = false
  box['style']['transform'] = "translate3d(#{currentX}px, #{currentY}px, 0)"
end

schedule_transform = proc do
  if raf_fn
    unless pendingFrame
      pendingFrame = true
      raf_fn.call(->(ts) { apply_transform.call(ts) })
    end
  else
    apply_transform.call(nil)
  end
end

base_shadow = box['style']['boxShadow']
drag_shadow = '0 8px 18px rgba(0,0,0,.22)'
drop_check = nil

startDrag = ->(event) {
  dragging = true
  dragPointerId = event['pointerId']
  if box['setPointerCapture']
    box['setPointerCapture'].call(dragPointerId)
  end
  box['style']['cursor'] = 'grabbing'
  box['style']['boxShadow'] = drag_shadow
  box['style']['transition'] = 'transform 0s, width .2s ease, height .2s ease, box-shadow .2s ease'
  startX = event['clientX'] - currentX
  startY = event['clientY'] - currentY
  if event['preventDefault']
    event['preventDefault'].call()
  end
}

moveDrag = ->(event) {
  if dragging && dragPointerId && event['pointerId'] == dragPointerId
    currentX = event['clientX'] - startX
    currentY = event['clientY'] - startY
    schedule_transform.call
  end
}

stopDrag = -> {
  if dragging
    dragging = false
    if dragPointerId && box['releasePointerCapture']
      box['releasePointerCapture'].call(dragPointerId)
    end
    dragPointerId = nil
    box['style']['cursor'] = 'grab'
    box['style']['boxShadow'] = base_shadow
    box['style']['transition'] = default_transition
    schedule_transform.call
  end
}

box.addEventListener('pointerdown', ->(event) {
  if !resizing
    button = event['button']
    if button == nil || button == 0
      startDrag.call(event)
    end
  end
})

# Resize logic
resizing = false
resizePointerId = nil
startW = 0
startH = 0
resizeOffsetX = 0.0
resizeOffsetY = 0.0
resizePrevTransition = ''

handle.addEventListener('pointerdown', ->(event) {
  resizing = true
  resizePointerId = event['pointerId']
  if handle['setPointerCapture']
    handle['setPointerCapture'].call(resizePointerId)
  end
  startX = event['clientX']
  startY = event['clientY']
  startW = box['offsetWidth']
  startH = box['offsetHeight']
  resizeOffsetX = currentX
  resizeOffsetY = currentY
  resizePrevTransition = box['style']['transition'] || default_transition
  box['style']['transition'] = 'none'
  box['style']['boxShadow'] = drag_shadow
  if event['stopPropagation']
    event['stopPropagation'].call()
  end
  if event['preventDefault']
    event['preventDefault'].call()
  end
})

document.addEventListener('pointermove', ->(event) {
  if resizing && resizePointerId && event['pointerId'] == resizePointerId
    dw = event['clientX'] - startX
    dh = event['clientY'] - startY
    newW = [100.0, startW.to_f + dw].max
    newH = [80.0, startH.to_f + dh].max
    currentX = resizeOffsetX + ((newW - startW.to_f) / 2.0)
    currentY = resizeOffsetY + ((newH - startH.to_f) / 2.0)
    box['style']['width'] = "#{newW.to_i}px"
    box['style']['height'] = "#{newH.to_i}px"
    schedule_transform.call
  elsif dragging && dragPointerId && event['pointerId'] == dragPointerId
    moveDrag.call(event)
  end
})

cleanup_resize = -> {
  resizing = false
  if handle['releasePointerCapture'] && resizePointerId
    handle['releasePointerCapture'].call(resizePointerId)
  end
  resizePointerId = nil
  box['style']['transition'] = resizePrevTransition || default_transition
  box['style']['boxShadow'] = base_shadow
  schedule_transform.call
}

document.addEventListener('pointerup', ->(event) {
  if resizing && resizePointerId && event['pointerId'] == resizePointerId
    cleanup_resize.call
    if event['preventDefault']
      event['preventDefault'].call()
    end
  elsif dragging && dragPointerId && event['pointerId'] == dragPointerId
    stopDrag.call
    if drop_check
      drop_check.call(event['clientX'], event['clientY'])
    end
  end
})

document.addEventListener('pointercancel', ->(event) {
  if resizing && resizePointerId && event['pointerId'] == resizePointerId
    cleanup_resize.call
  elsif dragging && dragPointerId && event['pointerId'] == dragPointerId
    stopDrag.call
  end
})

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

drop_check = ->(clientX, clientY) {
  if isOver.call(dropzone, clientX, clientY)
    currentX = 20
    currentY = 20
    schedule_transform.call
    console.log('dropped')
  end
}
