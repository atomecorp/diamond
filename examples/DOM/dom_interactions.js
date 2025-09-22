let box;
let boxX;
let boxY;
let container;
let dragging;
let dropzone;
let handle;
let isOver;
let label;
let moveDrag;
let parse_translate;
let resizing;
let startDrag;
let startH;
let startW;
let startX;
let startY;
let stopDrag;

const __rubyMinus = (left, right) => {
  if (Array.isArray(left)) {
    const rightValues = Array.isArray(right) ? right : [right];
    return left.filter((item) => rightValues.every((other) => other !== item));
  }
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
    return leftNumber - rightNumber;
  }
  return left - right;
};

const __rubyMatch = (value, pattern) => {
  let input = value;
  let regex = pattern;
  if (value instanceof RegExp || (value && typeof value === "object" && typeof value.exec === "function")) {
    regex = value;
    input = pattern;
  }
  const normalizedInput = String(input ?? "");
  const normalizedRegex = regex instanceof RegExp ? regex : new RegExp(String(regex));
  const result = normalizedInput.match(normalizedRegex);
  if (!result) return null;
  const wrapper = {
    captures: () => result.slice(1)
  };
  result.slice(1).forEach((value, index) => { wrapper[index] = value; });
  if (result.groups && typeof result.groups === "object") {
    for (const [key, value] of Object.entries(result.groups)) {
      wrapper[key] = value;
    }
  }
  return wrapper;
};

const __rubySend = (receiver, methodName, args = [], block) => {
  if (receiver == null) return undefined;
  const fn = receiver[methodName];
  if (typeof fn === "function") {
    const callArgs = block === undefined ? args : [...args, block];
    return fn.apply(receiver, callArgs);
  }
  if (typeof methodName === "string") {
    if (methodName === "tap") {
      if (typeof block === "function") {
        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;
        try { block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }
      }
      return receiver;
    }
    if (methodName === "then" || methodName === "yield_self") {
      if (typeof block === "function") {
        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;
        try { return block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }
      }
      return receiver;
    }
    if (methodName === "catch") {
      const tag = args[0];
      if (typeof block !== "function") return undefined;
      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;
      try {
        return block.call(receiver);
      } catch (error) {
        if (error && error.__rubyThrowTag !== undefined) {
          if (tag === undefined || tag === error.__rubyThrowTag || String(tag) === String(error.__rubyThrowTag)) {
            return error.__rubyThrowValue;
          }
        }
        throw error;
      } finally {
        if (typeof restore === "function") restore();
      }
    }
    if (methodName === "throw") {
      const tag = args[0];
      const value = args.length > 1 ? args[1] : undefined;
      const error = new Error("throw");
      error.__rubyThrowTag = tag;
      error.__rubyThrowValue = value;
      throw error;
    }
  }
  const missing = receiver.method_missing;
  if (typeof missing === "function") {
    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];
    return missing.apply(receiver, missingArgs);
  }
  throw new Error(`NoMethodError: undefined method ${methodName}`);
};

const __rubyToInteger = (value) => {
  const str = String(value ?? "").trimStart();
  const match = str.match(/^[+-]?\d+/);
  if (!match) return 0;
  const parsed = parseInt(match[0], 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const __rubyToFloat = (value) => {
  const num = parseFloat(String(value ?? ""));
  return Number.isNaN(num) ? 0 : num;
};

container = __rubySend(document, "createElement", ["div"], undefined);
container["style"]["width"] = "100%";
container["style"]["height"] = "100vh";
container["style"]["margin"] = "0";
container["style"]["display"] = "flex";
container["style"]["alignItems"] = "center";
container["style"]["justifyContent"] = "center";
container["style"]["background"] = "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)";
container["style"]["position"] = "relative";
__rubySend(document["body"], "appendChild", [container], undefined);
box = __rubySend(document, "createElement", ["div"], undefined);
box["style"]["width"] = "220px";
box["style"]["height"] = "140px";
box["style"]["borderRadius"] = "16px";
box["style"]["boxShadow"] = "0 10px 25px rgba(0,0,0,.25)";
box["style"]["background"] = "linear-gradient(135deg, #6EE7F9 0%, #9333EA 100%)";
box["style"]["position"] = "relative";
box["style"]["cursor"] = "grab";
box["style"]["userSelect"] = "none";
box["style"]["transform"] = "translate(0px, 0px)";
box["style"]["transition"] = "transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease";
__rubySend(container, "appendChild", [box], undefined);
label = __rubySend(document, "createElement", ["div"], undefined);
label["style"]["color"] = "#fff";
label["style"]["fontFamily"] = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
label["style"]["fontSize"] = "14px";
label["style"]["padding"] = "12px";
label["innerText"] = "Click / Tap / Drag me";
__rubySend(box, "appendChild", [label], undefined);
handle = __rubySend(document, "createElement", ["div"], undefined);
handle["style"]["position"] = "absolute";
handle["style"]["right"] = "6px";
handle["style"]["bottom"] = "6px";
handle["style"]["width"] = "14px";
handle["style"]["height"] = "14px";
handle["style"]["borderRadius"] = "3px";
handle["style"]["background"] = "rgba(255,255,255,.85)";
handle["style"]["boxShadow"] = "0 1px 3px rgba(0,0,0,.3)";
handle["style"]["cursor"] = "nwse-resize";
__rubySend(box, "appendChild", [handle], undefined);
__rubySend(box, "addEventListener", ["mouseenter", (e) => {
  return box["style"]["boxShadow"] = "0 14px 32px rgba(0,0,0,.32)";
}], undefined);
__rubySend(box, "addEventListener", ["mouseleave", (e) => {
  return box["style"]["boxShadow"] = "0 10px 25px rgba(0,0,0,.25)";
}], undefined);
__rubySend(box, "addEventListener", ["click", (e) => {
  return __rubySend(console, "log", ["clicked"], undefined);
}], undefined);
__rubySend(box, "addEventListener", ["touchstart", (e) => {
  return __rubySend(console, "log", ["tap"], undefined);
}], undefined);
dragging = false;
startX = 0;
startY = 0;
boxX = 0;
boxY = 0;
parse_translate = (t) => {
  let m;
  m = __rubyMatch(new RegExp("translate\\(([-\\d.]+)px, ([-\\d.]+)px\\)", ""), t);
  if (m) {
    return [__rubyToFloat(m[1]), __rubyToFloat(m[2])];
  }
  else {
    return [0, 0];
  }
};
startDrag = (clientX, clientY) => {
  let coords;
  dragging = true;
  box["style"]["cursor"] = "grabbing";
  startX = clientX;
  startY = clientY;
  coords = parse_translate(box["style"]["transform"] || "");
  boxX = coords[0];
  return boxY = coords[1];
};
moveDrag = (clientX, clientY) => {
  let dx;
  let dy;
  if (!dragging) {
    return;
  }
  dx = __rubyMinus(clientX, startX);
  dy = __rubyMinus(clientY, startY);
  return box["style"]["transform"] = `translate(${__rubyToInteger(boxX + dx)}px, ${__rubyToInteger(boxY + dy)}px)`;
};
stopDrag = () => {
  dragging = false;
  return box["style"]["cursor"] = "grab";
};
__rubySend(box, "addEventListener", ["mousedown", (e) => {
  startDrag(e["clientX"], e["clientY"]);
  return e["preventDefault"]();
}], undefined);
__rubySend(document, "addEventListener", ["mousemove", (e) => {
  return moveDrag(e["clientX"], e["clientY"]);
}], undefined);
__rubySend(document, "addEventListener", ["mouseup", (e) => {
  return stopDrag();
}], undefined);
__rubySend(box, "addEventListener", ["touchstart", (e) => {
  let t;
  t = e["touches"][0];
  return startDrag(t["clientX"], t["clientY"]);
}], undefined);
__rubySend(document, "addEventListener", ["touchmove", (e) => {
  let t;
  t = e["touches"][0];
  return moveDrag(t["clientX"], t["clientY"]);
}], undefined);
__rubySend(document, "addEventListener", ["touchend", (e) => {
  return stopDrag();
}], undefined);
resizing = false;
startW = 0;
startH = 0;
__rubySend(handle, "addEventListener", ["mousedown", (e) => {
  resizing = true;
  startX = e["clientX"];
  startY = e["clientY"];
  startW = box["offsetWidth"];
  startH = box["offsetHeight"];
  e["stopPropagation"]();
  return e["preventDefault"]();
}], undefined);
__rubySend(document, "addEventListener", ["mousemove", (e) => {
  let dh;
  let dw;
  let h;
  let w;
  if (resizing) {
    dw = __rubyMinus(e["clientX"], startX);
    dh = __rubyMinus(e["clientY"], startY);
    w = __rubyToInteger(Math.max(...[100, startW + dw]));
    h = __rubyToInteger(Math.max(...[80, startH + dh]));
    box["style"]["width"] = `${w}px`;
    return box["style"]["height"] = `${h}px`;
  }
}], undefined);
__rubySend(document, "addEventListener", ["mouseup", (e) => {
  return resizing = false;
}], undefined);
dropzone = __rubySend(document, "createElement", ["div"], undefined);
dropzone["style"]["position"] = "absolute";
dropzone["style"]["top"] = "20px";
dropzone["style"]["left"] = "20px";
dropzone["style"]["width"] = "120px";
dropzone["style"]["height"] = "80px";
dropzone["style"]["border"] = "2px dashed rgba(255,255,255,.75)";
dropzone["style"]["borderRadius"] = "8px";
dropzone["style"]["color"] = "#fff";
dropzone["style"]["display"] = "flex";
dropzone["style"]["alignItems"] = "center";
dropzone["style"]["justifyContent"] = "center";
dropzone["innerText"] = "Drop here";
__rubySend(container, "appendChild", [dropzone], undefined);
isOver = (el, x, y) => {
  let r;
  r = el["getBoundingClientRect"]();
  return x >= r["left"] && x <= r["right"] && y >= r["top"] && y <= r["bottom"];
};
__rubySend(document, "addEventListener", ["mouseup", (e) => {
  if (isOver(dropzone, e["clientX"], e["clientY"])) {
    box["style"]["transform"] = "translate(20px, 20px)";
    return __rubySend(console, "log", ["dropped"], undefined);
  }
}], undefined);